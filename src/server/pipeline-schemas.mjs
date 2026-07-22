const stringArray = {
  type: "array",
  items: { type: "string" },
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

export const planSchema = {
  type: "object",
  additionalProperties: false,
  required: ["deckId", "title", "description", "tags", "cards"],
  properties: {
    deckId: { type: "string" },
    title: { type: "string" },
    description: { type: "string" },
    tags: stringArray,
    cards: {
      type: "array",
      minItems: 1,
      maxItems: 24,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "title", "objective", "level", "durationMin", "family", "coveredTopics"],
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          objective: { type: "string" },
          level: { type: "string", enum: ["debutant", "intermediaire", "avance"] },
          durationMin: { type: "integer", minimum: 1, maximum: 10 },
          family: { type: "string" },
          coveredTopics: stringArray,
        },
      },
    },
  },
};

export const deckOutputSchema = {
  type: "object",
  additionalProperties: false,
  required: ["schemaVersion", "id", "title", "description", "tags", "cards"],
  properties: {
    schemaVersion: { const: 1 },
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
            items: {
              type: "object",
              additionalProperties: true,
            },
          },
        },
      },
    },
  },
};

