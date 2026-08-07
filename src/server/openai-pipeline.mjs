import OpenAI from "openai";
import {
  createPlanSchema,
  deckOutputSchema,
  expansionSchema,
  familiesSchema,
  normalizedSchema,
} from "./pipeline-schemas.mjs";
import { applyCalculatedDurations, estimateDeckMetrics } from "./card-metrics.mjs";
import { createMockPipeline } from "./mock-pipeline.mjs";
import { assertDeck, validateDeck, validationSummary } from "./validation.mjs";
import { createUsageCollector, readUsage } from "./usage-metrics.mjs";
import { slugify, uniqueSlug } from "./utils.mjs";

const DEFAULT_OPENAI_MODEL = "gpt-5.6";
// Un appel de plan ou de fiche avec un modele de raisonnement depasse largement
// la minute: un plafond trop bas coupait la generation en cours d'etape.
const DEFAULT_OPENAI_TIMEOUT_MS = 240_000;
const DEFAULT_OPENAI_MAX_RETRIES = 1;
const DEFAULT_MAX_OUTPUT_TOKENS = 12_000;
// Regrouper les fiches amortit le contexte fixe et le raisonnement de chaque
// appel, mais le gain doit etre valide contre l'API avant de devenir le defaut:
// un lot incomplet ferait echouer la generation.
const DEFAULT_DECK_BATCH_SIZE = 1;
const REASONING_EFFORTS = ["minimal", "low", "medium", "high"];

const SYSTEM_BASE = `Tu es Gnosis, un architecte pedagogique specialise dans les sujets techniques.
Tu construis des decks Kapsule en francais par defaut.
Tu privilegies la precision, les prerequis, les modes de defaillance, les exemples concrets et les quiz utiles.
Tu ne dois pas inventer de proprietes hors schemas.
Quand une information est incertaine, reste general et marque les limites dans le contenu pedagogique.`;

export class PipelineError extends Error {
  constructor(message, { code = "PIPELINE_ERROR", status = 500, cause } = {}) {
    super(message, { cause });
    this.name = "PipelineError";
    this.code = code;
    this.status = status;
  }
}

function clampNumber(value, min, max, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, Math.min(Math.trunc(parsed), max));
}

export function resolveOpenAISettings(env = process.env) {
  return {
    model: env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL,
    timeout: clampNumber(env.OPENAI_TIMEOUT_MS, 5_000, 600_000, DEFAULT_OPENAI_TIMEOUT_MS),
    maxRetries: clampNumber(env.OPENAI_MAX_RETRIES, 0, 5, DEFAULT_OPENAI_MAX_RETRIES),
    maxOutputTokens: clampNumber(
      env.OPENAI_MAX_OUTPUT_TOKENS,
      1_000,
      64_000,
      DEFAULT_MAX_OUTPUT_TOKENS,
    ),
    deckBatchSize: clampNumber(env.OPENAI_DECK_BATCH_SIZE, 1, 6, DEFAULT_DECK_BATCH_SIZE),
    // Levier de cout non active par defaut: la valeur doit etre validee contre
    // l'API avant d'etre imposee, un parametre refuse ferait echouer chaque appel.
    reasoningEffort: REASONING_EFFORTS.includes(env.OPENAI_REASONING_EFFORT)
      ? env.OPENAI_REASONING_EFFORT
      : null,
    tokenBudget: clampNumber(env.GNOSIS_TOKEN_BUDGET, 0, 10_000_000, 0),
  };
}

function jsonFormat(name, schema) {
  return {
    format: {
      type: "json_schema",
      name,
      strict: true,
      schema,
    },
  };
}

export function parseOutput(response) {
  if (response?.status === "incomplete") {
    throw new PipelineError(
      `Reponse OpenAI tronquee: ${response.incomplete_details?.reason || "raison inconnue"}.`,
      { code: "OPENAI_INCOMPLETE", status: 502 },
    );
  }
  const text = response.output_text;
  if (!text) {
    throw new PipelineError("OpenAI n'a retourne aucun JSON exploitable.", {
      code: "OPENAI_EMPTY_OUTPUT",
      status: 502,
    });
  }
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new PipelineError("JSON OpenAI invalide ou tronque.", {
      code: "OPENAI_INVALID_JSON",
      status: 502,
      cause: error,
    });
  }
}

function classifyOpenAIError(error) {
  const code = error?.code || error?.name || "";
  const message = String(error?.message || "");
  if (/timeout|timed out|ETIMEDOUT/i.test(`${code} ${message}`)) {
    return new PipelineError("L'appel OpenAI a depasse le delai configure.", {
      code: "OPENAI_TIMEOUT",
      status: 504,
      cause: error,
    });
  }
  // Le detail renvoye par OpenAI est la seule information exploitable pour
  // diagnostiquer un echec depuis l'interface: on le remonte au lieu de le perdre.
  return new PipelineError(`L'appel OpenAI a echoue: ${upstreamDetail(error)}`, {
    code: "OPENAI_REQUEST_FAILED",
    status: error?.status || 502,
    cause: error,
  });
}

function upstreamDetail(error) {
  const status = error?.status ? `HTTP ${error.status}` : "sans reponse HTTP";
  const detail = String(error?.error?.message || error?.message || "raison inconnue")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 300);
  return `${status} - ${detail}`;
}

export async function callStructured(client, settings, name, schema, input, overrides = {}) {
  overrides.budget?.assertRemaining();
  try {
    // `signal` est une option de requete du SDK: le placer dans le corps fait
    // rejeter l'appel par OpenAI ("Unknown parameter: 'signal'").
    const response = await client.responses.create(
      {
        model: settings.model,
        store: false,
        input,
        text: jsonFormat(name, schema),
        max_output_tokens: overrides.maxOutputTokens || settings.maxOutputTokens,
        ...(settings.reasoningEffort ? { reasoning: { effort: settings.reasoningEffort } } : {}),
      },
      { signal: overrides.signal },
    );
    const snapshot = overrides.usage?.record(overrides.stage, readUsage(response));
    if (snapshot) overrides.onUsage?.(snapshot);
    return parseOutput(response);
  } catch (error) {
    if (error instanceof PipelineError) throw error;
    throw classifyOpenAIError(error);
  }
}

/**
 * Borne de consommation d'une generation. Le depassement arrete le job avec une
 * erreur typee, la consommation deja engagee restant mesuree.
 */
export function createTokenBudget(maxTokens, usage) {
  if (!maxTokens) return null;
  return {
    assertRemaining() {
      if (usage.totalTokens < maxTokens) return;
      throw new PipelineError(
        `Budget de generation atteint: ${usage.totalTokens} tokens consommes pour une limite de ${maxTokens}.`,
        { code: "GENERATION_BUDGET_EXCEEDED", status: 402 },
      );
    },
  };
}

function pipelineSummary(normalized, families, expansion, plan, deck) {
  const metrics = estimateDeckMetrics(deck);
  const summary = plan.summary ?? {};
  const merged = summary.mergedTopics?.length ?? 0;
  const prerequisites = summary.addedPrerequisites?.length ?? 0;
  return [
    { name: "Normalisation", summary: `${normalized.topics.length} sujets nettoyes` },
    { name: "Familles", summary: `${families.families.length} familles pedagogiques` },
    {
      name: "Expansion",
      summary: `${expansion.families.reduce((sum, family) => sum + family.addedTopics.length, 0)} notions ajoutees`,
    },
    {
      name: "Plan",
      summary: `${plan.cards.length} fiches deduites de la couverture (${merged} fusions, ${prerequisites} prerequis)`,
    },
    { name: "Deck", summary: `${deck.cards.length} fiches Kapsule` },
    { name: "Calibration", summary: `${metrics.totalWords} mots / ${metrics.totalDurationMin} min calculees` },
    { name: "Validation", summary: "Schema Kapsule verifie" },
  ];
}

function normalizeDeckIds(deck) {
  const used = new Set();
  deck.id = slugify(deck.id || deck.title, "deck-gnosis");
  for (const card of deck.cards ?? []) {
    card.id = uniqueSlug(card.id || card.title, used);
  }
  return applyCalculatedDurations(deck);
}

async function repairDeck(client, model, deck, validation, calls) {
  const repaired = await callStructured(client, model, "kapsule_deck_repair", deckOutputSchema, [
    { role: "system", content: SYSTEM_BASE },
    {
      role: "user",
      content: `Corrige uniquement ce deck pour qu'il respecte le schema Kapsule.
Erreurs de validation:
${validationSummary(validation)}

Deck actuel:
${JSON.stringify(deck, null, 2)}

Contraintes:
- schemaVersion doit valoir 1.
- Chaque fiche doit contenir intro, concept(s), example, takeaways, quiz.
- Les sections autorisees sont intro, concept, example, takeaways, quiz.
- Aucune propriete additionnelle.
- quiz.answer est un index base 0 valide.`,
    },
  ], { ...calls, stage: "Reparation" });
  return normalizeDeckIds(repaired);
}

// Le lot doit contenir exactement les fiches demandees: sans minItems, un lot
// incomplet passerait le schema et le deck perdrait des fiches en silence.
function deckBatchSchema(batchSize) {
  return {
    ...deckOutputSchema,
    properties: {
      ...deckOutputSchema.properties,
      cards: {
        ...deckOutputSchema.properties.cards,
        minItems: batchSize,
        maxItems: batchSize,
      },
    },
  };
}

/**
 * Ne conserve de l'expansion que les familles couvertes par le lot: renvoyer
 * l'expansion complete a chaque fiche etait la principale redondance d'entree.
 */
export function expansionForBatch(expansion, batch) {
  const families = new Set(batch.map((card) => card.family).filter(Boolean));
  const kept = (expansion?.families ?? []).filter(
    (family) => families.has(family.title) || families.has(family.id),
  );
  return { families: kept.length > 0 ? kept : (expansion?.families ?? []).slice(0, 1) };
}

async function generateDeckBatches(client, settings, plan, expansion, calls, onProgress) {
  const batches = [];
  for (let index = 0; index < plan.cards.length; index += settings.deckBatchSize) {
    batches.push(plan.cards.slice(index, index + settings.deckBatchSize));
  }

  const deck = {
    schemaVersion: 1,
    id: plan.deckId,
    title: plan.title,
    description: plan.description,
    tags: plan.tags,
    cards: [],
  };

  for (const [index, batch] of batches.entries()) {
    onProgress?.("Fiches", Math.round((index / batches.length) * 70) + 20);
    const partial = await callStructured(
      client,
      settings,
      `kapsule_deck_batch_${index + 1}`,
      deckBatchSchema(batch.length),
      [
        { role: "system", content: SYSTEM_BASE },
        {
          role: "user",
          content: `Genere uniquement les fiches Kapsule du lot ${index + 1}/${batches.length}.
Retourne un deck JSON valide contenant seulement les fiches demandees dans cards.
Respecte strictement:
- schemaVersion: 1
- sections autorisees: intro, concept, example, takeaways, quiz
- chaque fiche finit par un quiz
- aucune propriete additionnelle
- Markdown leger uniquement dans content
- fiches precises et concretes, sans volume inutile
- respecte objective et autonomyReason de chaque fiche; n'ajoute aucun contenu pour atteindre un volume
- durationMin doit correspondre au volume reel: ceil(mots / 190) + ceil(nb_questions / 2)

Metadonnees du deck:
${JSON.stringify({ id: plan.deckId, title: plan.title, description: plan.description, tags: plan.tags }, null, 2)}

Fiches a generer:
${JSON.stringify(batch, null, 2)}

Expansion des familles concernees:
${JSON.stringify(expansionForBatch(expansion, batch), null, 2)}`,
        },
      ],
      {
        ...calls,
        stage: "Fiches",
        // Le budget de sortie configure vaut par fiche: un lot en demande autant.
        maxOutputTokens: Math.min(64_000, settings.maxOutputTokens * batch.length),
      },
    );
    deck.cards.push(...(partial.cards || []));
  }

  if (deck.cards.length !== plan.cards.length) {
    throw new PipelineError(
      `Le deck genere contient ${deck.cards.length} fiches pour ${plan.cards.length} planifiees.`,
      { code: "DECK_INCOMPLETE", status: 502 },
    );
  }

  return normalizeDeckIds(deck);
}

export async function generateDeckPipeline({ topics, options = {}, env = process.env, signal, onProgress, onUsage }) {
  const settings = resolveOpenAISettings(env);
  const usage = createUsageCollector();
  const cardCeiling = clampNumber(options.cardCeiling, 2, 100, 24);
  const useMock = env.GNOSIS_MOCK_OPENAI === "1" || env.NODE_ENV === "test";

  if (useMock) {
    const mock = createMockPipeline(topics, options);
    normalizeDeckIds(mock.deck);
    const validation = assertDeck(mock.deck);
    return {
      ...mock,
      validation,
      pipeline: pipelineSummary(mock.normalized, mock.families, mock.expansion, mock.plan, mock.deck),
      metrics: estimateDeckMetrics(mock.deck),
      usage: usage.snapshot(),
      model: "mock",
    };
  }

  if (!env.OPENAI_API_KEY) {
    throw new PipelineError("OPENAI_API_KEY est manquante cote serveur.", {
      code: "OPENAI_API_KEY_MISSING",
      status: 503,
    });
  }

  const client = new OpenAI({
    apiKey: env.OPENAI_API_KEY,
    timeout: settings.timeout,
    maxRetries: settings.maxRetries,
  });
  // Options communes a chaque appel: signal d'annulation, mesure de consommation
  // et borne de budget. La consommation reste attachee au job meme en cas d'echec.
  const calls = {
    signal,
    usage,
    onUsage,
    budget: createTokenBudget(settings.tokenBudget, usage),
  };
  const context = {
    topics,
    options,
    kapsuleContract: {
      schemaVersion: 1,
      sections: ["intro", "concept", "example", "takeaways", "quiz"],
      cardDurationMin: "1-10",
      quiz: "1 a 3 questions utiles par fiche, choix unique, answer base 0",
      durationCalibration:
        "durationMin est recalcule par Gnosis: ceil(mots / 190) + ceil(nb_questions / 2), borne a 10 pour le schema",
    },
  };

  onProgress?.("Normalisation", 5);
  const normalized = await callStructured(client, settings, "gnosis_normalized_topics", normalizedSchema, [
    { role: "system", content: SYSTEM_BASE },
    {
      role: "user",
      content: `Nettoie et normalise ces sujets techniques. Fusionne les synonymes sans perdre l'intention utilisateur.
Contexte:
${JSON.stringify(context, null, 2)}`,
    },
  ], { ...calls, stage: "Normalisation" });

  onProgress?.("Familles", 15);
  const families = await callStructured(client, settings, "gnosis_topic_families", familiesSchema, [
    { role: "system", content: SYSTEM_BASE },
    {
      role: "user",
      content: `Regroupe ces sujets normalises en grandes familles pedagogiques. Ordonne les familles du plus fondamental au plus avance.
Sujets normalises:
${JSON.stringify(normalized, null, 2)}
Options:
${JSON.stringify(options, null, 2)}`,
    },
  ], { ...calls, stage: "Familles" });

  onProgress?.("Expansion", 25);
  const expansion = await callStructured(client, settings, "gnosis_family_expansion", expansionSchema, [
    { role: "system", content: SYSTEM_BASE },
    {
      role: "user",
      content: `Complete chaque famille uniquement avec les prerequis indispensables a la comprehension des notions saisies.
Chaque ajout doit etre justifie par une dependance reelle; tout ce qui est seulement interessant ou decoratif va dans excludedTopics.
N'ajoute rien pour enrichir le volume du deck.
Familles:
${JSON.stringify(families, null, 2)}
Sujets normalises:
${JSON.stringify(normalized, null, 2)}`,
    },
  ], { ...calls, stage: "Expansion" });

  onProgress?.("Plan", 35);
  const plan = await callStructured(client, settings, "gnosis_deck_plan", createPlanSchema(cardCeiling), [
    { role: "system", content: SYSTEM_BASE },
    {
      role: "user",
      content: `Transforme les familles enrichies en plan de deck Kapsule.
Aucun nombre cible de fiches n'existe: deduis le nombre minimal de fiches necessaires a une couverture progressive des notions saisies.
Regles de granularite:
- une fiche = un objectif d'apprentissage autonome, non redondant (origin "notion", sourceTopic = notion saisie couverte);
- fusionne les sous-notions qui ne meritent pas une fiche separee et declare la fusion dans summary.mergedTopics;
- n'ajoute un prerequis (origin "prerequis") que s'il est indispensable a la comprehension au niveau ${options.level || "intermediaire"}, avec sa justification dans summary.addedPrerequisites;
- refuse toute extension non necessaire et trace-la dans summary.excludedExtensions;
- n'ajoute jamais une fiche, un mot ou une minute pour atteindre un volume: mieux vaut un deck court et juste;
- autonomyReason explique pourquoi chaque fiche se tient seule;
- summary.rationale resume en deux phrases le plan retenu.
Le plafond de ${cardCeiling} fiches est une limite technique de securite, jamais un objectif.
La duree finale sera calculee depuis le volume reel: ceil(mots / 190) + ceil(nb_questions / 2).
Entree:
${JSON.stringify({ normalized, families, expansion, options }, null, 2)}`,
    },
  ], { ...calls, stage: "Plan" });

  const deck = await generateDeckBatches(client, settings, plan, expansion, calls, onProgress);

  let validation = validateDeck(deck);
  let finalDeck = deck;
  if (!validation.valid) {
    finalDeck = await repairDeck(client, settings, deck, validation, calls);
    validation = validateDeck(finalDeck);
  }

  if (!validation.valid) {
    const error = new PipelineError("Le deck genere reste invalide apres reparation.", {
      code: "KAPSULE_VALIDATION_FAILED",
      status: 422,
    });
    error.validation = validation;
    throw error;
  }

  return {
    normalized,
    families,
    expansion,
    plan,
    deck: finalDeck,
    validation,
    pipeline: pipelineSummary(normalized, families, expansion, plan, finalDeck),
    metrics: estimateDeckMetrics(finalDeck),
    usage: usage.snapshot(),
    model: settings.model,
  };
}
