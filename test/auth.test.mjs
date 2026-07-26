import test from "node:test";
import assert from "node:assert/strict";
import Database from "better-sqlite3";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import request from "supertest";
import { createApp } from "../src/server/app.mjs";
import { encryptClaimLensSecret } from "../src/server/auth.mjs";

async function fixture() {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "gnosis-auth-"));
  const kapsulePath = path.join(dir, "kapsule.sqlite");
  const claimLensPath = path.join(dir, "claimlens.sqlite");
  const password = "correct horse battery staple";
  const salt = crypto.randomBytes(16);
  const digest = crypto.scryptSync(password, salt, 64, { N: 16_384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
  const passwordHash = `scrypt:${salt.toString("hex")}:${digest.toString("hex")}`;
  const secret = "test-encryption-secret";
  const openAiKey = "sk-test-shared-key";

  const kapsule = new Database(kapsulePath);
  kapsule.exec(`CREATE TABLE users (id TEXT PRIMARY KEY, email TEXT UNIQUE, password_hash TEXT NOT NULL)`);
  kapsule.prepare("INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)").run("kapsule-user-1", "user@example.com", passwordHash);
  kapsule.close();

  const claimLens = new Database(claimLensPath);
  claimLens.exec(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      display_name TEXT,
      is_active INTEGER NOT NULL DEFAULT 1
    );
    CREATE TABLE sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token_hash TEXT NOT NULL UNIQUE,
      csrf_token TEXT NOT NULL,
      expires_at TEXT NOT NULL
    );
    CREATE TABLE user_api_keys (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      provider TEXT NOT NULL,
      encrypted_value TEXT NOT NULL,
      key_fingerprint TEXT NOT NULL,
      masked_value TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, provider)
    );
  `);
  claimLens.prepare(
    `INSERT INTO users (email, password_hash, display_name) VALUES (?, ?, ?)`,
  ).run("user@example.com", "kapsule:kapsule-user-1", "user@example.com");
  claimLens.prepare(
    `INSERT INTO user_api_keys (user_id, provider, encrypted_value, key_fingerprint, masked_value)
     VALUES (1, 'openai', ?, ?, ?)` ,
  ).run(encryptClaimLensSecret(openAiKey, secret), "fingerprint", "sk-t...-key");
  claimLens.close();

  return { dir, kapsulePath, claimLensPath, password, secret, openAiKey };
}

async function waitForCompletion(agent, id) {
  let job;
  for (let attempt = 0; attempt < 30; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 5));
    job = (await agent.get(`/api/generate-deck/${id}`)).body;
    if (job.status === "completed" || job.status === "failed") return job;
  }
  return job;
}

test("federated login reuses a ClaimLens OpenAI key and isolates jobs", async () => {
  const data = await fixture();
  const app = createApp({
    NODE_ENV: "test",
    GNOSIS_MOCK_OPENAI: "1",
    GNOSIS_KAPSULE_DB: data.kapsulePath,
    GNOSIS_CLAIMLENS_DB: data.claimLensPath,
    GNOSIS_KEY_ENCRYPTION_SECRET: data.secret,
  });
  const userAgent = request.agent(app);
  const otherAgent = request.agent(app);

  const login = await userAgent
    .post("/api/auth/login")
    .send({ email: "USER@example.com", password: data.password })
    .expect(200);
  assert.equal(login.body.hasOpenAiKey, true);
  assert.equal((await userAgent.get("/api/session")).body.openAiKey.masked, "sk-t...-key");

  const generated = await userAgent
    .post("/api/generate-deck")
    .set("x-csrf-token", login.body.csrfToken)
    .send({ topics: ["DNS", "TCP"], options: { targetCards: 2 } })
    .expect(202);
  const completed = await waitForCompletion(userAgent, generated.body.id);
  assert.equal(completed.status, "completed");
  assert.equal(JSON.stringify(completed).includes(data.openAiKey), false);
  assert.equal((await otherAgent.get(`/api/generate-deck/${generated.body.id}`)).status, 404);
});

test("guest keys remain request-local and guest jobs are isolated", async () => {
  const app = createApp({ NODE_ENV: "test", GNOSIS_MOCK_OPENAI: "1" });
  const guest = request.agent(app);
  const otherGuest = request.agent(app);
  const guestKey = "sk-test-guest-only";
  const response = await guest
    .post("/api/generate-deck")
    .send({ topics: ["DNS", "TCP"], options: { targetCards: 2 }, apiKey: guestKey })
    .expect(202);
  const completed = await waitForCompletion(guest, response.body.id);
  assert.equal(completed.status, "completed");
  assert.equal(JSON.stringify(completed).includes(guestKey), false);
  assert.equal((await otherGuest.get(`/api/generate-deck/${response.body.id}`)).status, 404);
});
