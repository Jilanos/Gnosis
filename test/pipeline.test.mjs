import test from "node:test";
import assert from "node:assert/strict";
import {
  callStructured,
  generateDeckPipeline,
  parseOutput,
  resolveOpenAISettings,
} from "../src/server/openai-pipeline.mjs";

function mockRun(topics, options = {}) {
  return generateDeckPipeline({
    topics,
    options,
    env: { NODE_ENV: "test", OPENAI_MODEL: "mock" },
  });
}

test("mock pipeline produces a valid Kapsule deck", async () => {
  const result = await mockRun(["DNS", "IPv4", "Docker"], {
    title: "Infra web",
    level: "intermediaire",
  });

  assert.equal(result.validation.valid, true);
  assert.equal(result.deck.schemaVersion, 1);
  assert.equal(result.deck.cards.length, 3);
  assert.equal(result.deck.cards[0].sections.at(-1).type, "quiz");
  assert.equal(result.metrics.cards.length, 3);
  assert.equal(result.deck.cards[0].durationMin, result.metrics.cards[0].schemaDurationMin);
});

test("a single notion produces a single autonomous card", async () => {
  const result = await mockRun(["Git rebase"]);

  assert.equal(result.plan.cards.length, 1);
  assert.equal(result.plan.cards[0].origin, "notion");
  assert.ok(result.plan.cards[0].autonomyReason.length > 0);
  assert.deepEqual(result.plan.summary.addedPrerequisites, []);
  assert.deepEqual(result.plan.summary.mergedTopics, []);
});

test("redundant notions are merged into one card with a traced reason", async () => {
  const result = await mockRun(["TCP", "TCP handshake", "handshake TCP"]);

  assert.equal(result.plan.cards.length, 1);
  assert.equal(result.plan.summary.mergedTopics.length, 1);
  const [merged] = result.plan.summary.mergedTopics;
  assert.equal(merged.canonical, "TCP handshake");
  assert.deepEqual(merged.aliases.sort(), ["TCP", "handshake TCP"]);
  assert.match(merged.reason, /redondant/i);
  assert.deepEqual(
    result.plan.cards[0].coveredTopics.sort(),
    ["TCP", "TCP handshake", "handshake TCP"],
  );
});

test("an indispensable prerequisite is added with its justification", async () => {
  const result = await mockRun(["TLS"], { level: "intermediaire" });

  assert.equal(result.plan.cards.length, 2);
  const prerequisite = result.plan.cards[0];
  assert.equal(prerequisite.origin, "prerequis");
  assert.equal(prerequisite.title, "TCP/IP");
  assert.equal(prerequisite.sourceTopic, "TLS");
  assert.equal(result.plan.summary.addedPrerequisites.length, 1);
  assert.match(result.plan.summary.addedPrerequisites[0].reason, /transport/i);
});

test("a prerequisite already covered by the input is not duplicated", async () => {
  const result = await mockRun(["TLS", "TCP"]);

  assert.deepEqual(result.plan.summary.addedPrerequisites, []);
  assert.equal(result.plan.cards.length, 2);
});

test("a prerequisite already retained is not added twice", async () => {
  const result = await mockRun(["TLS", "DNS"]);

  assert.deepEqual(
    result.plan.summary.addedPrerequisites.map((entry) => entry.label),
    ["TCP/IP"],
  );
  assert.equal(result.plan.cards.length, 3);
});

test("an advanced level excludes assumed prerequisites and traces the exclusion", async () => {
  const result = await mockRun(["TLS"], { level: "avance" });

  assert.equal(result.plan.cards.length, 1);
  assert.deepEqual(result.plan.summary.addedPrerequisites, []);
  assert.equal(result.plan.summary.excludedExtensions.length, 1);
  assert.equal(result.plan.summary.excludedExtensions[0].label, "TCP/IP");
  assert.match(result.plan.summary.excludedExtensions[0].reason, /avance/i);
});

test("no card is added to reach a volume, even when a legacy quota is supplied", async () => {
  const withoutQuota = await mockRun(["Git rebase", "Docker"]);
  const withLegacyQuota = await mockRun(["Git rebase", "Docker"], { targetCards: 12 });

  assert.equal(withoutQuota.plan.cards.length, 2);
  assert.equal(withLegacyQuota.plan.cards.length, 2);
  assert.equal(withLegacyQuota.deck.cards.length, 2);
  assert.match(withLegacyQuota.plan.summary.rationale, /Aucun contenu n'a ete ajoute/);
});

test("the card ceiling only truncates and traces the overflow", async () => {
  const topics = ["Git", "Docker", "Ansible", "Terraform"];
  const result = await mockRun(topics, { cardCeiling: 2 });

  assert.equal(result.plan.cards.length, 2);
  assert.equal(result.plan.summary.excludedExtensions.length, 2);
  assert.match(result.plan.summary.excludedExtensions[0].reason, /Plafond technique/);
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
      async create(payload, options) {
        calls.push({ payload, options });
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
  assert.equal(calls[0].payload.model, "gpt-test");
  assert.equal(calls[0].payload.max_output_tokens, 4321);
  assert.equal(calls[0].payload.store, false);
});

test("callStructured passes the abort signal as a request option, never in the body", async () => {
  const calls = [];
  const client = {
    responses: {
      async create(payload, options) {
        calls.push({ payload, options });
        return { status: "completed", output_text: '{"ok":true}' };
      },
    },
  };
  const controller = new AbortController();

  await callStructured(
    client,
    resolveOpenAISettings({ OPENAI_MODEL: "gpt-test" }),
    "test_schema",
    { type: "object", additionalProperties: false, required: ["ok"], properties: { ok: { type: "boolean" } } },
    [{ role: "user", content: "test" }],
    { signal: controller.signal },
  );

  // OpenAI rejette la requete avec "Unknown parameter: 'signal'" si le signal
  // se retrouve dans le corps: toute generation reelle echouait en HTTP 400.
  assert.equal("signal" in calls[0].payload, false);
  assert.equal(calls[0].options.signal, controller.signal);
});

test("a failed OpenAI call reports the upstream status and message", async () => {
  const client = {
    responses: {
      async create() {
        const error = new Error("400 Unknown parameter: 'signal'.");
        error.status = 400;
        throw error;
      },
    },
  };

  await assert.rejects(
    () =>
      callStructured(
        client,
        resolveOpenAISettings({ OPENAI_MODEL: "gpt-test" }),
        "test_schema",
        { type: "object", additionalProperties: false, required: ["ok"], properties: { ok: { type: "boolean" } } },
        [{ role: "user", content: "test" }],
      ),
    (error) => {
      assert.equal(error.code, "OPENAI_REQUEST_FAILED");
      assert.equal(error.status, 400);
      assert.match(error.message, /HTTP 400/);
      assert.match(error.message, /Unknown parameter/);
      return true;
    },
  );
});
