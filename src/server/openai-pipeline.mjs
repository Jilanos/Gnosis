import OpenAI from "openai";
import {
  deckOutputSchema,
  expansionSchema,
  familiesSchema,
  normalizedSchema,
  planSchema,
} from "./pipeline-schemas.mjs";
import { applyCalculatedDurations, estimateDeckMetrics } from "./card-metrics.mjs";
import { createMockPipeline } from "./mock-pipeline.mjs";
import { assertDeck, validateDeck, validationSummary } from "./validation.mjs";
import { slugify, uniqueSlug } from "./utils.mjs";

const SYSTEM_BASE = `Tu es Gnosis, un architecte pedagogique specialise dans les sujets techniques.
Tu construis des decks Kapsule en francais par defaut.
Tu privilegies la precision, les prerequis, les modes de defaillance, les exemples concrets et les quiz utiles.
Tu ne dois pas inventer de proprietes hors schemas.
Quand une information est incertaine, reste general et marque les limites dans le contenu pedagogique.`;

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

function parseOutput(response) {
  const text = response.output_text;
  if (!text) throw new Error("OpenAI n'a retourne aucun JSON exploitable.");
  return JSON.parse(text);
}

async function callStructured(client, model, name, schema, input) {
  const response = await client.responses.create({
    model,
    store: false,
    input,
    text: jsonFormat(name, schema),
  });
  return parseOutput(response);
}

function pipelineSummary(normalized, families, expansion, plan, deck) {
  const metrics = estimateDeckMetrics(deck);
  return [
    { name: "Normalisation", summary: `${normalized.topics.length} sujets nettoyes` },
    { name: "Familles", summary: `${families.families.length} familles pedagogiques` },
    {
      name: "Expansion",
      summary: `${expansion.families.reduce((sum, family) => sum + family.addedTopics.length, 0)} notions ajoutees`,
    },
    { name: "Plan", summary: `${plan.cards.length} fiches planifiees` },
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

async function repairDeck(client, model, deck, validation) {
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
  ]);
  return normalizeDeckIds(repaired);
}

export async function generateDeckPipeline({ topics, options = {}, env = process.env }) {
  const model = env.OPENAI_MODEL || "gpt-5.6";
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
      model: "mock",
    };
  }

  if (!env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY est manquante cote serveur.");
  }

  const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
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

  const normalized = await callStructured(client, model, "gnosis_normalized_topics", normalizedSchema, [
    { role: "system", content: SYSTEM_BASE },
    {
      role: "user",
      content: `Nettoie et normalise ces sujets techniques. Fusionne les synonymes sans perdre l'intention utilisateur.
Contexte:
${JSON.stringify(context, null, 2)}`,
    },
  ]);

  const families = await callStructured(client, model, "gnosis_topic_families", familiesSchema, [
    { role: "system", content: SYSTEM_BASE },
    {
      role: "user",
      content: `Regroupe ces sujets normalises en grandes familles pedagogiques. Ordonne les familles du plus fondamental au plus avance.
Sujets normalises:
${JSON.stringify(normalized, null, 2)}
Options:
${JSON.stringify(options, null, 2)}`,
    },
  ]);

  const expansion = await callStructured(client, model, "gnosis_family_expansion", expansionSchema, [
    { role: "system", content: SYSTEM_BASE },
    {
      role: "user",
      content: `Complete chaque famille avec les connaissances tres proches et fortement liees.
Ajoute seulement ce qui augmente la precision du deck sans elargir abusivement le scope.
Familles:
${JSON.stringify(families, null, 2)}
Sujets normalises:
${JSON.stringify(normalized, null, 2)}`,
    },
  ]);

  const plan = await callStructured(client, model, "gnosis_deck_plan", planSchema, [
    { role: "system", content: SYSTEM_BASE },
    {
      role: "user",
      content: `Transforme les familles enrichies en plan de deck Kapsule.
Le nombre cible de fiches est ${options.targetCards || 8}; ne depasse pas 24 fiches.
Chaque fiche doit etre autonome, progressive et lisible en 5 a 10 minutes.
La duree finale sera calculee depuis le volume reel: ceil(mots / 190) + ceil(nb_questions / 2).
Entree:
${JSON.stringify({ normalized, families, expansion, options }, null, 2)}`,
    },
  ]);

  const deck = normalizeDeckIds(
    await callStructured(client, model, "kapsule_deck", deckOutputSchema, [
      { role: "system", content: SYSTEM_BASE },
      {
        role: "user",
        content: `Genere le deck final au format Kapsule JSON.
Respecte strictement:
- schemaVersion: 1
- sections autorisees: intro, concept, example, takeaways, quiz
- chaque fiche finit par un quiz
- aucune propriete additionnelle
- Markdown leger uniquement dans content
- fiches denses, precises, concretes, avec exemples et pieges
- durationMin doit correspondre au volume reel: ceil(mots / 190) + ceil(nb_questions / 2)

Plan:
${JSON.stringify(plan, null, 2)}

Expansion:
${JSON.stringify(expansion, null, 2)}`,
      },
    ]),
  );

  let validation = validateDeck(deck);
  let finalDeck = deck;
  if (!validation.valid) {
    finalDeck = await repairDeck(client, model, deck, validation);
    validation = validateDeck(finalDeck);
  }

  if (!validation.valid) {
    const error = new Error("Le deck genere reste invalide apres reparation.");
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
    model,
  };
}
