export const kapsuleDeckSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://kapsule.app/schemas/deck.schema.json",
  title: "Kapsule Deck",
  description: "Un deck Kapsule : un ensemble ordonne de fiches de connaissance courtes.",
  type: "object",
  additionalProperties: false,
  required: ["schemaVersion", "id", "title", "cards"],
  properties: {
    schemaVersion: { const: 1 },
    id: {
      type: "string",
      pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
      minLength: 1,
      maxLength: 80,
    },
    title: { type: "string", minLength: 1, maxLength: 120 },
    description: { type: "string", maxLength: 500 },
    tags: {
      type: "array",
      items: { type: "string", minLength: 1, maxLength: 40 },
      maxItems: 20,
      uniqueItems: true,
    },
    cards: {
      type: "array",
      minItems: 1,
      maxItems: 200,
      items: { $ref: "#/$defs/card" },
    },
  },
  $defs: {
    card: {
      type: "object",
      additionalProperties: false,
      required: ["id", "title", "sections"],
      properties: {
        id: {
          type: "string",
          pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
          minLength: 1,
          maxLength: 80,
        },
        title: { type: "string", minLength: 1, maxLength: 120 },
        durationMin: { type: "integer", minimum: 1, maximum: 10 },
        level: { type: "string", enum: ["debutant", "intermediaire", "avance"] },
        sections: {
          type: "array",
          minItems: 1,
          maxItems: 30,
          items: { $ref: "#/$defs/section" },
        },
      },
    },
    section: {
      type: "object",
      required: ["type"],
      oneOf: [
        { $ref: "#/$defs/sectionIntro" },
        { $ref: "#/$defs/sectionConcept" },
        { $ref: "#/$defs/sectionExample" },
        { $ref: "#/$defs/sectionTakeaways" },
        { $ref: "#/$defs/sectionQuiz" },
      ],
    },
    sectionIntro: {
      type: "object",
      additionalProperties: false,
      required: ["type", "content"],
      properties: {
        type: { const: "intro" },
        content: { $ref: "#/$defs/richText" },
      },
    },
    sectionConcept: {
      type: "object",
      additionalProperties: false,
      required: ["type", "content"],
      properties: {
        type: { const: "concept" },
        heading: { type: "string", minLength: 1, maxLength: 120 },
        content: { $ref: "#/$defs/richText" },
        image: { $ref: "#/$defs/image" },
      },
    },
    sectionExample: {
      type: "object",
      additionalProperties: false,
      required: ["type", "content"],
      properties: {
        type: { const: "example" },
        heading: { type: "string", minLength: 1, maxLength: 120 },
        content: { $ref: "#/$defs/richText" },
        image: { $ref: "#/$defs/image" },
      },
    },
    sectionTakeaways: {
      type: "object",
      additionalProperties: false,
      required: ["type", "items"],
      properties: {
        type: { const: "takeaways" },
        heading: { type: "string", minLength: 1, maxLength: 120 },
        items: {
          type: "array",
          minItems: 1,
          maxItems: 10,
          items: { type: "string", minLength: 1, maxLength: 280 },
        },
      },
    },
    sectionQuiz: {
      type: "object",
      additionalProperties: false,
      required: ["type", "questions"],
      properties: {
        type: { const: "quiz" },
        heading: { type: "string", minLength: 1, maxLength: 120 },
        questions: {
          type: "array",
          minItems: 1,
          maxItems: 10,
          items: { $ref: "#/$defs/quizQuestion" },
        },
      },
    },
    quizQuestion: {
      type: "object",
      additionalProperties: false,
      required: ["q", "choices", "answer"],
      properties: {
        q: { type: "string", minLength: 1, maxLength: 280 },
        choices: {
          type: "array",
          minItems: 2,
          maxItems: 6,
          items: { type: "string", minLength: 1, maxLength: 200 },
        },
        answer: { type: "integer", minimum: 0 },
        explanation: { type: "string", maxLength: 500 },
      },
    },
    richText: {
      type: "string",
      minLength: 1,
      maxLength: 2000,
    },
    image: {
      type: "object",
      additionalProperties: false,
      required: ["src"],
      properties: {
        src: { type: "string", minLength: 1, maxLength: 3000000 },
        alt: { type: "string", maxLength: 280 },
        caption: { type: "string", maxLength: 280 },
      },
    },
  },
};

