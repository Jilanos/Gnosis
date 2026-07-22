import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";
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

