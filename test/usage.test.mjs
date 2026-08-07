import test from "node:test";
import assert from "node:assert/strict";
import {
  callStructured,
  createTokenBudget,
  expansionForBatch,
  resolveOpenAISettings,
} from "../src/server/openai-pipeline.mjs";
import { createUsageCollector, readUsage } from "../src/server/usage-metrics.mjs";

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["ok"],
  properties: { ok: { type: "boolean" } },
};

function respondingClient(usage) {
  const calls = [];
  return {
    calls,
    responses: {
      async create(payload, options) {
        calls.push({ payload, options });
        return { status: "completed", output_text: '{"ok":true}', usage };
      },
    },
  };
}

const USAGE = {
  input_tokens: 1200,
  input_tokens_details: { cached_tokens: 400 },
  output_tokens: 800,
  output_tokens_details: { reasoning_tokens: 500 },
  total_tokens: 2000,
};

test("readUsage extracts input, output and reasoning tokens", () => {
  assert.deepEqual(readUsage({ usage: USAGE }), {
    inputTokens: 1200,
    cachedInputTokens: 400,
    outputTokens: 800,
    reasoningTokens: 500,
    totalTokens: 2000,
    calls: 1,
  });
  assert.equal(readUsage({}), null);
});

test("the collector aggregates usage per stage and overall", () => {
  const usage = createUsageCollector();
  usage.record("Plan", readUsage({ usage: USAGE }));
  usage.record("Fiches", readUsage({ usage: USAGE }));
  usage.record("Fiches", readUsage({ usage: USAGE }));

  const snapshot = usage.snapshot();
  assert.deepEqual(
    snapshot.stages.map((stage) => [stage.name, stage.calls]),
    [["Plan", 1], ["Fiches", 2]],
  );
  assert.equal(snapshot.totals.totalTokens, 6000);
  assert.equal(snapshot.totals.reasoningTokens, 1500);
  assert.equal(snapshot.totals.calls, 3);
});

test("callStructured records the usage of each call under its stage", async () => {
  const client = respondingClient(USAGE);
  const usage = createUsageCollector();
  const seen = [];

  await callStructured(
    client,
    resolveOpenAISettings({ OPENAI_MODEL: "gpt-test" }),
    "probe",
    SCHEMA,
    [{ role: "user", content: "test" }],
    { usage, stage: "Plan", onUsage: (snapshot) => seen.push(snapshot) },
  );

  assert.equal(usage.snapshot().stages[0].name, "Plan");
  assert.equal(usage.totalTokens, 2000);
  assert.equal(seen.length, 1);
  assert.equal(seen[0].totals.totalTokens, 2000);
});

test("a response without usage leaves the collector untouched", async () => {
  const client = respondingClient(undefined);
  const usage = createUsageCollector();

  await callStructured(
    client,
    resolveOpenAISettings({ OPENAI_MODEL: "gpt-test" }),
    "probe",
    SCHEMA,
    [{ role: "user", content: "test" }],
    { usage, stage: "Plan" },
  );

  assert.deepEqual(usage.snapshot().stages, []);
  assert.equal(usage.totalTokens, 0);
});

test("the token budget stops the generation and keeps the measured consumption", async () => {
  const client = respondingClient(USAGE);
  const usage = createUsageCollector();
  const settings = resolveOpenAISettings({ OPENAI_MODEL: "gpt-test", GNOSIS_TOKEN_BUDGET: "3000" });
  const budget = createTokenBudget(settings.tokenBudget, usage);
  const call = () =>
    callStructured(client, settings, "probe", SCHEMA, [{ role: "user", content: "x" }], {
      usage,
      stage: "Fiches",
      budget,
    });

  await call();
  await call();

  await assert.rejects(call, (error) => {
    assert.equal(error.code, "GENERATION_BUDGET_EXCEEDED");
    assert.equal(error.status, 402);
    assert.match(error.message, /4000 tokens consommes/);
    return true;
  });
  assert.equal(usage.totalTokens, 4000);
  assert.equal(client.calls.length, 2);
});

test("no budget configured means no ceiling", () => {
  const settings = resolveOpenAISettings({ OPENAI_MODEL: "gpt-test" });
  assert.equal(settings.tokenBudget, 0);
  assert.equal(createTokenBudget(settings.tokenBudget, createUsageCollector()), null);
});

test("a card batch only carries the expansion of the families it covers", () => {
  const expansion = {
    families: [
      { id: "reseau", title: "Fondations reseau", coreTopics: ["DNS"], addedTopics: [], excludedTopics: [] },
      { id: "deploiement", title: "Deploiement", coreTopics: ["Docker"], addedTopics: [], excludedTopics: [] },
    ],
  };
  const batch = [{ family: "Fondations reseau" }];

  const scoped = expansionForBatch(expansion, batch);

  assert.equal(scoped.families.length, 1);
  assert.equal(scoped.families[0].title, "Fondations reseau");
  assert.ok(
    JSON.stringify(scoped).length < JSON.stringify(expansion).length,
    "le contexte envoye doit etre plus petit que l'expansion complete",
  );
});

test("an unknown family still ships a usable expansion context", () => {
  const expansion = { families: [{ id: "a", title: "A", coreTopics: [], addedTopics: [], excludedTopics: [] }] };

  assert.equal(expansionForBatch(expansion, [{ family: "Inconnue" }]).families.length, 1);
  assert.deepEqual(expansionForBatch({ families: [] }, [{ family: "X" }]), { families: [] });
});

test("the reasoning effort is only sent when explicitly configured", async () => {
  const withDefault = respondingClient(USAGE);
  await callStructured(withDefault, resolveOpenAISettings({ OPENAI_MODEL: "gpt-test" }), "probe", SCHEMA, []);
  assert.equal("reasoning" in withDefault.calls[0].payload, false);

  const withEffort = respondingClient(USAGE);
  await callStructured(
    withEffort,
    resolveOpenAISettings({ OPENAI_MODEL: "gpt-test", OPENAI_REASONING_EFFORT: "low" }),
    "probe",
    SCHEMA,
    [],
  );
  assert.deepEqual(withEffort.calls[0].payload.reasoning, { effort: "low" });

  const withGarbage = respondingClient(USAGE);
  await callStructured(
    withGarbage,
    resolveOpenAISettings({ OPENAI_MODEL: "gpt-test", OPENAI_REASONING_EFFORT: "turbo" }),
    "probe",
    SCHEMA,
    [],
  );
  assert.equal("reasoning" in withGarbage.calls[0].payload, false);
});
