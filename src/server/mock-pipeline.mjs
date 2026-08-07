import { planCoverage } from "./plan-coverage.mjs";
import { slugify } from "./utils.mjs";

function familyFor(topic) {
  const lower = topic.toLowerCase();
  if (/(dns|tcp|ip|nat|cidr|tls|proxy|http|reseau|réseau)/.test(lower)) {
    return "Fondations reseau";
  }
  if (/(docker|ci|cd|deploy|deploiement|déploiement|pipeline|container)/.test(lower)) {
    return "Deploiement et automatisation";
  }
  return "Concepts techniques";
}

export function createMockPipeline(topics, options = {}) {
  const coverage = planCoverage(topics, {
    level: options.level,
    familyFor,
    cardCeiling: options.cardCeiling,
  });

  const normalized = {
    topics: coverage.groups.map((group) => ({
      label: group.canonical,
      kind: "concept",
      confidence: 0.82,
    })),
    merged: coverage.summary.mergedTopics.map(({ canonical, aliases }) => ({ canonical, aliases })),
    warnings: [],
  };

  const grouped = new Map();
  for (const group of coverage.groups) {
    const family = familyFor(group.canonical);
    if (!grouped.has(family)) grouped.set(family, []);
    grouped.get(family).push(group.canonical);
  }

  const families = {
    families: [...grouped.entries()].map(([title, familyTopics], index) => ({
      id: slugify(title, `famille-${index + 1}`),
      title,
      description: `Famille pedagogique autour de ${familyTopics.slice(0, 3).join(", ")}.`,
      topics: familyTopics,
      prerequisites: index === 0 ? [] : ["vocabulaire technique de base"],
      order: index + 1,
    })),
  };

  // Seuls les prerequis indispensables sont ajoutes, avec leur justification;
  // les extensions non necessaires restent tracees dans excludedTopics.
  const expansion = {
    families: families.families.map((family) => ({
      id: family.id,
      title: family.title,
      coreTopics: family.topics,
      addedTopics: coverage.summary.addedPrerequisites
        .filter((prerequisite) => familyFor(prerequisite.label) === family.title)
        .map((prerequisite) => ({
          label: prerequisite.label,
          reason: prerequisite.reason,
          importance: "forte",
        })),
      excludedTopics: coverage.summary.excludedExtensions.map((extension) => extension.label),
    })),
  };

  const plan = {
    deckId: slugify(options.title || coverage.cards[0]?.title || "deck-gnosis", "deck-gnosis"),
    title: options.title || "Deck technique Gnosis",
    description:
      "Deck genere par Gnosis : notions techniques organisees, enrichies et transformees en fiches Kapsule avec quiz.",
    tags: ["gnosis", "technique", "kapsule"],
    summary: coverage.summary,
    cards: coverage.cards,
  };

  const deck = {
    schemaVersion: 1,
    id: plan.deckId,
    title: plan.title,
    description: plan.description,
    tags: plan.tags,
    cards: plan.cards.map((card) => ({
      id: card.id,
      title: card.title,
      durationMin: card.durationMin,
      level: card.level,
      sections: [
        {
          type: "intro",
          content: `**${card.title}** est une notion a comprendre dans son contexte, pas seulement comme definition isolee. Cette fiche la replace dans une famille technique et montre comment raisonner dessus.`,
        },
        {
          type: "concept",
          heading: "Role de la notion",
          content: `${card.title} sert a structurer une partie du systeme technique. Pour la maitriser, il faut identifier son objectif, ses entrees, ses sorties, et les symptomes visibles quand elle est mal configuree.`,
        },
        {
          type: "concept",
          heading: "Liens proches",
          content: `Notions fortement liees : ${card.coveredTopics.join(", ")}. Ces liens permettent de passer d'une connaissance de vocabulaire a une connaissance operationnelle.`,
        },
        {
          type: "example",
          heading: "En pratique",
          content: `Face a un incident autour de ${card.title}, commence par verifier la configuration attendue, observe les messages d'erreur, puis isole la couche responsable avant de modifier le systeme.`,
        },
        {
          type: "takeaways",
          heading: "A retenir",
          items: [
            `${card.title} doit etre compris avec son role et ses limites.`,
            "Les notions proches aident a diagnostiquer les problemes reels.",
            "Un bon apprentissage technique combine definition, exemple et mode de defaillance.",
          ],
        },
        {
          type: "quiz",
          questions: [
            {
              q: `Quel est le meilleur signe qu'on maitrise vraiment ${card.title} ?`,
              choices: [
                "Savoir repeter une definition courte",
                "Savoir l'expliquer, l'utiliser et diagnostiquer une panne liee",
                "Connaitre uniquement son acronyme",
              ],
              answer: 1,
              explanation:
                "La maitrise technique combine comprehension, usage concret et diagnostic des erreurs frequentes.",
            },
          ],
        },
      ],
    })),
  };

  return { normalized, families, expansion, plan, deck };
}

