const stringArray = {
  type: "array",
  items: { type: "string" },
};

const richText = {
  type: "string",
  minLength: 1,
  maxLength: 2000,
};

const quizQuestion = {
  type: "object",
  additionalProperties: false,
  required: ["q", "choices", "answer", "explanation"],
  properties: {
    q: { type: "string" },
    choices: {
      type: "array",
      minItems: 2,
      maxItems: 6,
      items: { type: "string" },
    },
    answer: { type: "integer", minimum: 0 },
    explanation: { type: "string" },
  },
};

const sectionSchema = {
  type: "object",
  anyOf: [
    {
      type: "object",
      additionalProperties: false,
      required: ["type", "content"],
      properties: {
        type: { type: "string", const: "intro" },
        content: richText,
      },
    },
    {
      type: "object",
      additionalProperties: false,
      required: ["type", "heading", "content"],
      properties: {
        type: { type: "string", const: "concept" },
        heading: { type: "string" },
        content: richText,
      },
    },
    {
      type: "object",
      additionalProperties: false,
      required: ["type", "heading", "content"],
      properties: {
        type: { type: "string", const: "example" },
        heading: { type: "string" },
        content: richText,
      },
    },
    {
      type: "object",
      additionalProperties: false,
      required: ["type", "heading", "items"],
      properties: {
        type: { type: "string", const: "takeaways" },
        heading: { type: "string" },
        items: {
          type: "array",
          minItems: 1,
          maxItems: 10,
          items: { type: "string" },
        },
      },
    },
    {
      type: "object",
      additionalProperties: false,
      required: ["type", "heading", "questions"],
      properties: {
        type: { type: "string", const: "quiz" },
        heading: { type: "string" },
        questions: {
          type: "array",
          minItems: 1,
          maxItems: 10,
          items: quizQuestion,
        },
      },
    },
  ],
};

export const normalizedSchema = {
  type: "object",
  additionalProperties: false,
  required: ["topics", "merged", "warnings"],
  properties: {
    topics: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["label", "kind", "confidence"],
        properties: {
          label: { type: "string" },
          kind: {
            type: "string",
            enum: ["concept", "outil", "protocole", "commande", "pratique", "autre"],
          },
          confidence: { type: "number" },
        },
      },
    },
    merged: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["canonical", "aliases"],
        properties: {
          canonical: { type: "string" },
          aliases: stringArray,
        },
      },
    },
    warnings: stringArray,
  },
};

export const familiesSchema = {
  type: "object",
  additionalProperties: false,
  required: ["families"],
  properties: {
    families: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "title", "description", "topics", "prerequisites", "order"],
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          topics: stringArray,
          prerequisites: stringArray,
          order: { type: "integer" },
        },
      },
    },
  },
};

export const expansionSchema = {
  type: "object",
  additionalProperties: false,
  required: ["families"],
  properties: {
    families: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "title", "coreTopics", "addedTopics", "excludedTopics"],
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          coreTopics: stringArray,
          addedTopics: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["label", "reason", "importance"],
              properties: {
                label: { type: "string" },
                reason: { type: "string" },
                importance: { type: "string", enum: ["forte", "moyenne", "faible"] },
              },
            },
          },
          excludedTopics: stringArray,
        },
      },
    },
  },
};

const planSummarySchema = {
  type: "object",
  additionalProperties: false,
  required: ["rationale", "mergedTopics", "addedPrerequisites", "excludedExtensions"],
  properties: {
    rationale: { type: "string" },
    mergedTopics: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["canonical", "aliases", "reason"],
        properties: {
          canonical: { type: "string" },
          aliases: stringArray,
          reason: { type: "string" },
        },
      },
    },
    addedPrerequisites: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["label", "reason", "requiredFor"],
        properties: {
          label: { type: "string" },
          reason: { type: "string" },
          requiredFor: { type: "string" },
        },
      },
    },
    excludedExtensions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["label", "reason"],
        properties: {
          label: { type: "string" },
          reason: { type: "string" },
        },
      },
    },
  },
};

/**
 * Le plan ne recoit aucun nombre cible de fiches. `cardCeiling` est un plafond
 * technique de securite (cout, taille de reponse), jamais un objectif a atteindre.
 */
export function createPlanSchema(cardCeiling = 24) {
  return {
    type: "object",
    additionalProperties: false,
    required: ["deckId", "title", "description", "tags", "summary", "cards"],
    properties: {
      deckId: { type: "string" },
      title: { type: "string" },
      description: { type: "string" },
      tags: stringArray,
      summary: planSummarySchema,
      cards: {
        type: "array",
        minItems: 1,
        maxItems: cardCeiling,
        items: {
          type: "object",
          additionalProperties: false,
          required: [
            "id",
            "title",
            "objective",
            "level",
            "durationMin",
            "family",
            "coveredTopics",
            "origin",
            "sourceTopic",
            "autonomyReason",
          ],
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            objective: { type: "string" },
            level: { type: "string", enum: ["debutant", "intermediaire", "avance"] },
            durationMin: { type: "integer", minimum: 1, maximum: 10 },
            family: { type: "string" },
            coveredTopics: stringArray,
            origin: { type: "string", enum: ["notion", "prerequis"] },
            sourceTopic: { type: "string" },
            autonomyReason: { type: "string" },
          },
        },
      },
    },
  };
}

export const planSchema = createPlanSchema();

export const deckOutputSchema = {
  type: "object",
  additionalProperties: false,
  required: ["schemaVersion", "id", "title", "description", "tags", "cards"],
  properties: {
    schemaVersion: { type: "integer", const: 1 },
    id: { type: "string" },
    title: { type: "string" },
    description: { type: "string" },
    tags: stringArray,
    cards: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "title", "durationMin", "level", "sections"],
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          durationMin: { type: "integer" },
          level: { type: "string", enum: ["debutant", "intermediaire", "avance"] },
          sections: {
            type: "array",
            minItems: 5,
            items: sectionSchema,
          },
        },
      },
    },
  },
};
