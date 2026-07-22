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
    })
    .expect(200);

  assert.equal(response.body.validation.valid, true);
  assert.equal(response.body.deck.cards.length, 2);
});

test("POST /api/generate-deck rejects empty input", async () => {
  const app = createApp({ NODE_ENV: "test" });

  const response = await request(app)
    .post("/api/generate-deck")
    .send({ topics: [] })
    .expect(400);

  assert.match(response.body.error, /au moins un sujet/);
});

