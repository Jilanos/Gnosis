import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import request from "supertest";
import { createApp } from "../src/server/app.mjs";

test("POST /api/generate-deck returns a valid deck in mock mode", async () => {
  const app = createApp({
    NODE_ENV: "test",
    OPENAI_MODEL: "mock",
    MAX_INPUT_TOPICS: "20",
    MAX_CARDS: "8",
  });

  const response = await request(app)
    .post("/api/generate-deck")
    .send({
      topics: ["DNS", "TCP handshake"],
      options: { title: "Reseaux essentiels", targetCards: 2 },
      apiKey: "sk-test-not-a-real-key",
    })
    .expect(202);

  let job = response.body;
  for (let attempt = 0; attempt < 20 && job.status !== "completed"; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 5));
    job = (await request(app).get(`/api/generate-deck/${job.id}`)).body;
  }
  assert.equal(job.status, "completed");
  assert.equal(job.result.validation.valid, true);
  assert.equal(job.result.deck.cards.length, 2);
  assert.equal(job.result.metrics.cards.length, 2);
  assert.equal(job.result.deck.cards[0].durationMin, job.result.metrics.cards[0].schemaDurationMin);
  assert.equal(JSON.stringify(response.body).includes("sk-test-not-a-real-key"), false);
});

test("production app serves the Vite shell while keeping the API routes", async () => {
  const staticDir = await fs.mkdtemp(path.join(os.tmpdir(), "gnosis-static-"));
  await fs.writeFile(path.join(staticDir, "index.html"), "<html>gnosis-shell</html>");
  const app = createApp({ STATIC_DIR: staticDir });

  const response = await request(app).get("/").expect(200);
  assert.match(response.text, /gnosis-shell/);
});

test("POST /api/generate-deck rejects empty input", async () => {
  const app = createApp({ NODE_ENV: "test" });

  const response = await request(app)
    .post("/api/generate-deck")
    .send({ topics: [] })
    .expect(400);

  assert.match(response.body.error, /au moins un sujet/);
});

test("GET /api/health reports whether a server API key is configured", async () => {
  const app = createApp({ OPENAI_API_KEY: "sk-server-key" });

  const response = await request(app).get("/api/health").expect(200);

  assert.equal(response.body.ok, true);
  assert.equal(response.body.hasServerApiKey, true);
});

test("POST /api/generate-deck protects the server OpenAI key in production", async () => {
  const app = createApp({
    NODE_ENV: "production",
    GNOSIS_MOCK_OPENAI: "1",
    OPENAI_API_KEY: "sk-server-key",
  });

  const response = await request(app)
    .post("/api/generate-deck")
    .send({
      topics: ["DNS", "TCP"],
      options: { targetCards: 2 },
    })
    .expect(503);

  assert.match(response.body.error, /GNOSIS_ACCESS_TOKEN/);
});

test("POST /api/generate-deck accepts the configured access token in production", async () => {
  const app = createApp({
    NODE_ENV: "production",
    GNOSIS_MOCK_OPENAI: "1",
    OPENAI_API_KEY: "sk-server-key",
    GNOSIS_ACCESS_TOKEN: "local-secret",
  });

  const response = await request(app)
    .post("/api/generate-deck")
    .set("x-gnosis-access-token", "local-secret")
    .send({
      topics: ["DNS", "TCP"],
      options: { targetCards: 2 },
    })
    .expect(202);

  assert.ok(["queued", "running"].includes(response.body.status));
});
