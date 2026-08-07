import { slugify, uniqueSlug } from "./utils.mjs";

// Contrat de granularite: le nombre de fiches derive de la couverture utile des
// notions saisies et de leurs prerequis indispensables. Aucun quota de fiches,
// de mots ou de duree n'entre dans ce calcul.

const PREREQUISITES = [
  {
    match: /\b(tls|ssl|mtls|certificat)\b/,
    label: "TCP/IP",
    satisfiedBy: /\b(tcp|ip|ipv4|ipv6|reseau)\b/,
    reason: "TLS ne peut pas etre compris sans la couche transport qu'il securise.",
  },
  {
    match: /\b(dns|resolution de noms)\b/,
    label: "adressage IP",
    satisfiedBy: /\b(ip|ipv4|ipv6|adressage|cidr)\b/,
    reason: "La resolution de noms n'a de sens qu'une fois l'adressage IP compris.",
  },
  {
    match: /\b(kubernetes|k8s|orchestration)\b/,
    label: "conteneurisation",
    satisfiedBy: /\b(docker|conteneur|container|podman)\b/,
    reason: "L'orchestration suppose de savoir ce qu'est un conteneur et son cycle de vie.",
  },
  {
    match: /\b(ci\/cd|ci cd|cicd|deploiement continu)\b/,
    label: "controle de version",
    satisfiedBy: /\b(git|version|vcs)\b/,
    reason: "Un pipeline continu se declenche sur un historique de versions maitrise.",
  },
  {
    match: /\b(reverse proxy|load balancer|repartition de charge)\b/,
    label: "HTTP",
    satisfiedBy: /\b(http|https|web)\b/,
    reason: "Un proxy inverse se raisonne a partir du protocole qu'il relaie.",
  },
];

function tokens(label) {
  return slugify(label, "").split("-").filter(Boolean);
}

function coversSameNotion(a, b) {
  const left = tokens(a);
  const right = tokens(b);
  if (left.length === 0 || right.length === 0) return false;
  const [short, long] = left.length <= right.length ? [left, right] : [right, left];
  return short.every((token) => long.includes(token));
}

/**
 * Fusionne les notions redondantes. La notion la plus specifique devient
 * canonique: elle couvre l'intention de ses alias sans creer de fiche en double.
 */
export function mergeRedundantTopics(topics) {
  const groups = [];

  for (const topic of topics) {
    const group = groups.find((candidate) => coversSameNotion(candidate.canonical, topic));
    if (!group) {
      groups.push({ canonical: topic, aliases: [] });
      continue;
    }
    if (tokens(topic).length > tokens(group.canonical).length) {
      group.aliases.push(group.canonical);
      group.canonical = topic;
    } else {
      group.aliases.push(topic);
    }
  }

  return groups;
}

function isAlreadyCovered(rule, canonicalTopics) {
  return canonicalTopics.some(
    (candidate) =>
      coversSameNotion(candidate, rule.label) || rule.satisfiedBy.test(` ${candidate.toLowerCase()} `),
  );
}

function requiredPrerequisites(canonicalTopics) {
  const found = [];
  for (const topic of canonicalTopics) {
    const lower = ` ${topic.toLowerCase()} `;
    for (const rule of PREREQUISITES) {
      if (!rule.match.test(lower)) continue;
      // Un prerequis deja retenu peut satisfaire un autre prerequis: on ne le
      // dedouble pas.
      if (isAlreadyCovered(rule, [...canonicalTopics, ...found.map((entry) => entry.label)])) continue;
      found.push({ label: rule.label, reason: rule.reason, requiredFor: topic });
    }
  }
  return found;
}

function planCard(usedIds, { title, objective, level, family, coveredTopics, origin, sourceTopic, autonomyReason }) {
  return {
    id: uniqueSlug(title, usedIds),
    title,
    objective,
    level,
    durationMin: 7,
    family,
    coveredTopics,
    origin,
    sourceTopic,
    autonomyReason,
  };
}

/**
 * Calcule la couverture pedagogique d'un ensemble de notions pour un niveau
 * donne: fiches retenues, fusions, prerequis ajoutes et extensions ecartees.
 *
 * @param {string[]} topics notions saisies par l'utilisateur
 * @param {{ level?: string, familyFor?: (topic: string) => string, cardCeiling?: number }} options
 */
export function planCoverage(topics, options = {}) {
  const level = options.level || "intermediaire";
  const familyFor = options.familyFor || (() => "Concepts techniques");
  const ceiling = Number.isInteger(options.cardCeiling) ? options.cardCeiling : 24;

  const groups = mergeRedundantTopics(topics);
  const canonicalTopics = groups.map((group) => group.canonical);
  const candidates = requiredPrerequisites(canonicalTopics);

  const addedPrerequisites = [];
  const excludedExtensions = [];
  for (const candidate of candidates) {
    if (level === "avance") {
      excludedExtensions.push({
        label: candidate.label,
        reason: `Prerequis suppose acquis au niveau avance pour ${candidate.requiredFor}; aucune fiche ajoutee.`,
      });
      continue;
    }
    addedPrerequisites.push(candidate);
  }

  const usedIds = new Set();
  const cards = [];

  for (const prerequisite of addedPrerequisites) {
    cards.push(
      planCard(usedIds, {
        title: prerequisite.label,
        objective: `Acquerir ${prerequisite.label} au niveau strictement necessaire pour aborder ${prerequisite.requiredFor}.`,
        level,
        family: familyFor(prerequisite.label),
        coveredTopics: [prerequisite.label],
        origin: "prerequis",
        sourceTopic: prerequisite.requiredFor,
        autonomyReason: prerequisite.reason,
      }),
    );
  }

  for (const group of groups) {
    const coveredTopics = [group.canonical, ...group.aliases];
    cards.push(
      planCard(usedIds, {
        title: group.canonical,
        objective: `Comprendre ${group.canonical}, ses usages, ses limites et ses erreurs frequentes.`,
        level,
        family: familyFor(group.canonical),
        coveredTopics,
        origin: "notion",
        sourceTopic: group.canonical,
        autonomyReason:
          group.aliases.length > 0
            ? `Objectif autonome couvrant aussi ${group.aliases.join(", ")}, notions redondantes fusionnees.`
            : "Objectif d'apprentissage autonome pour une notion saisie.",
      }),
    );
  }

  const merged = groups
    .filter((group) => group.aliases.length > 0)
    .map((group) => ({
      canonical: group.canonical,
      aliases: group.aliases,
      reason: "Formulations redondantes de la meme notion: une seule fiche suffit a la couvrir.",
    }));

  const overflow = cards.length > ceiling ? cards.length - ceiling : 0;
  const retained = overflow > 0 ? cards.slice(0, ceiling) : cards;
  if (overflow > 0) {
    for (const card of cards.slice(ceiling)) {
      excludedExtensions.push({
        label: card.title,
        reason: `Plafond technique de ${ceiling} fiches atteint; notion a traiter dans une generation dediee.`,
      });
    }
  }

  return {
    groups,
    cards: retained,
    summary: {
      rationale: summaryRationale(retained, merged, addedPrerequisites, excludedExtensions),
      mergedTopics: merged,
      addedPrerequisites,
      excludedExtensions,
    },
  };
}

export function summaryRationale(cards, merged, addedPrerequisites, excludedExtensions) {
  const parts = [
    `${cards.length} fiche${cards.length > 1 ? "s" : ""} retenue${cards.length > 1 ? "s" : ""} : une par objectif d'apprentissage autonome.`,
  ];
  parts.push(
    merged.length > 0
      ? `${merged.length} notion${merged.length > 1 ? "s" : ""} fusionnee${merged.length > 1 ? "s" : ""} pour eviter la redondance.`
      : "Aucune notion redondante detectee.",
  );
  parts.push(
    addedPrerequisites.length > 0
      ? `${addedPrerequisites.length} prerequis indispensable${addedPrerequisites.length > 1 ? "s" : ""} ajoute${addedPrerequisites.length > 1 ? "s" : ""}.`
      : "Aucun prerequis ajoute.",
  );
  if (excludedExtensions.length > 0) {
    parts.push(`${excludedExtensions.length} extension${excludedExtensions.length > 1 ? "s" : ""} ecartee${excludedExtensions.length > 1 ? "s" : ""} comme non indispensable${excludedExtensions.length > 1 ? "s" : ""}.`);
  }
  parts.push("Aucun contenu n'a ete ajoute pour atteindre un nombre de fiches, de mots ou de minutes.");
  return parts.join(" ");
}
