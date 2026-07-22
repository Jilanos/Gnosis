import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";
import { estimateCardMetrics } from "../src/server/card-metrics.mjs";
import { validateDeck } from "../src/server/validation.mjs";

test("validates a Kapsule deck fixture", () => {
  const deck = JSON.parse(readFileSync("fixtures/sample-deck.json", "utf8"));
  const validation = validateDeck(deck);
  assert.equal(validation.valid, true);
});

test("rejects invalid quiz answer indexes", () => {
  const deck = JSON.parse(readFileSync("fixtures/sample-deck.json", "utf8"));
  deck.cards[0].sections.at(-1).questions[0].answer = 4;
  const validation = validateDeck(deck);
  assert.equal(validation.valid, false);
  assert.match(validation.errors[0].message, /hors limites/);
});

test("estimates card words and duration from readable content", () => {
  const deck = JSON.parse(readFileSync("fixtures/sample-deck.json", "utf8"));
  const metrics = estimateCardMetrics(deck.cards[0]);

  assert.equal(metrics.questionCount, 1);
  assert.equal(metrics.calculatedDurationMin, 2);
  assert.equal(metrics.schemaDurationMin, 2);
  assert.equal(metrics.belowMinimum, true);
  assert.ok(metrics.wordCount > 40);
});
