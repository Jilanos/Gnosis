import test from "node:test";
import assert from "node:assert/strict";
import { generateDeckPipeline } from "../src/server/openai-pipeline.mjs";

test("mock pipeline produces a valid Kapsule deck", async () => {
  const result = await generateDeckPipeline({
    topics: ["DNS", "TCP", "Docker"],
    options: { title: "Infra web", targetCards: 3, level: "intermediaire" },
    env: { NODE_ENV: "test", OPENAI_MODEL: "mock" },
  });

  assert.equal(result.validation.valid, true);
  assert.equal(result.deck.schemaVersion, 1);
  assert.equal(result.deck.cards.length, 3);
  assert.equal(result.deck.cards[0].sections.at(-1).type, "quiz");
  assert.equal(result.metrics.cards.length, 3);
  assert.equal(result.deck.cards[0].durationMin, result.metrics.cards[0].schemaDurationMin);
});
