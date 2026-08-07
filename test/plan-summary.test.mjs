import test from "node:test";
import assert from "node:assert/strict";
import { planCardCount, planRationale, planSummaryLines } from "../src/client/plan-summary.mjs";
import { generateDeckPipeline } from "../src/server/openai-pipeline.mjs";

test("client reads the plan summary decisions produced by the pipeline", async () => {
  const result = await generateDeckPipeline({
    topics: ["TLS", "Docker", "Docker engine"],
    options: { level: "intermediaire" },
    env: { NODE_ENV: "test", OPENAI_MODEL: "mock" },
  });

  const lines = planSummaryLines(result.plan);
  assert.equal(planCardCount(result.plan), result.deck.cards.length);
  assert.match(planRationale(result.plan), /fiches retenues/);
  assert.ok(lines.some((line) => line.kind === "fusion" && line.label === "Docker engine"));
  assert.ok(lines.some((line) => line.kind === "prerequis" && line.detail.includes("TLS")));
});

test("client renders nothing when the response carries no plan", () => {
  assert.deepEqual(planSummaryLines(undefined), []);
  assert.equal(planCardCount(undefined), 0);
  assert.equal(planRationale(undefined), "");
});

test("client tolerates a plan summary without optional decision lists", () => {
  const plan = { cards: [{ id: "a" }], summary: { rationale: "1 fiche retenue." } };

  assert.deepEqual(planSummaryLines(plan), []);
  assert.equal(planCardCount(plan), 1);
  assert.equal(planRationale(plan), "1 fiche retenue.");
});
