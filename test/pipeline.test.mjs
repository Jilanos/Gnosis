import test from "node:test";
import assert from "node:assert/strict";
import {
  callStructured,
  generateDeckPipeline,
  parseOutput,
  resolveOpenAISettings,
} from "../src/server/openai-pipeline.mjs";

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

test("parseOutput rejects incomplete OpenAI responses with a typed error", () => {
  assert.throws(
    () =>
      parseOutput({
        status: "incomplete",
        incomplete_details: { reason: "max_output_tokens" },
        output_text: '{"partial":',
      }),
    (error) => {
      assert.equal(error.code, "OPENAI_INCOMPLETE");
      assert.equal(error.status, 502);
      assert.match(error.message, /tronquee/);
      return true;
    },
  );
});

test("parseOutput rejects invalid JSON with a typed error", () => {
  assert.throws(
    () => parseOutput({ status: "completed", output_text: '{"partial":' }),
    (error) => {
      assert.equal(error.code, "OPENAI_INVALID_JSON");
      assert.equal(error.status, 502);
      return true;
    },
  );
});

test("callStructured sends a bounded max_output_tokens budget", async () => {
  const calls = [];
  const client = {
    responses: {
      async create(payload) {
        calls.push(payload);
        return { status: "completed", output_text: '{"ok":true}' };
      },
    },
  };
  const settings = resolveOpenAISettings({
    OPENAI_MODEL: "gpt-test",
    OPENAI_MAX_OUTPUT_TOKENS: "4321",
  });

  const result = await callStructured(
    client,
    settings,
    "test_schema",
    {
      type: "object",
      additionalProperties: false,
      required: ["ok"],
      properties: { ok: { type: "boolean" } },
    },
    [{ role: "user", content: "test" }],
  );

  assert.deepEqual(result, { ok: true });
  assert.equal(calls[0].model, "gpt-test");
  assert.equal(calls[0].max_output_tokens, 4321);
  assert.equal(calls[0].store, false);
});
