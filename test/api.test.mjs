import test from "node:test";
import assert from "node:assert/strict";
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
    .expect(200);

  assert.equal(response.body.validation.valid, true);
  assert.equal(response.body.deck.cards.length, 2);
  assert.equal(response.body.metrics.cards.length, 2);
  assert.equal(response.body.deck.cards[0].durationMin, response.body.metrics.cards[0].schemaDurationMin);
  assert.equal(JSON.stringify(response.body).includes("sk-test-not-a-real-key"), false);
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
