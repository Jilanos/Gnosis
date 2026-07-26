import Database from "better-sqlite3";
import crypto from "node:crypto";

const SESSION_DAYS = 14;
const SESSION_COOKIE = "claimlens_session";
const GUEST_COOKIE = "gnosis_guest";
const KEY_AAD = Buffer.from("claimlens-secret-v2");

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function parseCookieHeader(header) {
  return Object.fromEntries(
    String(header || "")
      .split(";")
      .map((part) => part.trim().split("="))
      .filter(([key, value]) => key && value)
      .map(([key, ...value]) => [key, decodeURIComponent(value.join("="))]),
  );
}

function scryptPasswordMatches(password, stored) {
  const [algorithm, saltHex, digestHex] = String(stored || "").split(":");
  if (algorithm !== "scrypt" || !saltHex || !digestHex) return false;
  try {
    const salt = Buffer.from(saltHex, "hex");
    const expected = Buffer.from(digestHex, "hex");
    const actual = crypto.scryptSync(password, salt, expected.length, {
      N: 16_384,
      r: 8,
      p: 1,
      maxmem: 64 * 1024 * 1024,
    });
    return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

function decryptClaimLensSecret(encrypted, deploymentSecret) {
  if (!deploymentSecret || !String(encrypted).startsWith("v2:")) return null;
  try {
    const raw = Buffer.from(String(encrypted).slice(3), "base64url");
    const nonce = raw.subarray(0, 12);
    const tag = raw.subarray(raw.length - 16);
    const ciphertext = raw.subarray(12, raw.length - 16);
    const key = crypto
      .createHash("sha256")
      .update(Buffer.concat([Buffer.from("claimlens-aead-v2:"), Buffer.from(deploymentSecret)]))
      .digest();
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, nonce);
    decipher.setAAD(KEY_AAD);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
  } catch {
    return null;
  }
}

function encryptClaimLensSecret(value, deploymentSecret) {
  if (!deploymentSecret) throw new Error("GNOSIS_KEY_ENCRYPTION_SECRET est requis.");
  const nonce = crypto.randomBytes(12);
  const key = crypto
    .createHash("sha256")
    .update(Buffer.concat([Buffer.from("claimlens-aead-v2:"), Buffer.from(deploymentSecret)]))
    .digest();
  const cipher = crypto.createCipheriv("aes-256-gcm", key, nonce);
  cipher.setAAD(KEY_AAD);
  const ciphertext = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  return `v2:${Buffer.concat([nonce, ciphertext, cipher.getAuthTag()]).toString("base64url")}`;
}

function maskedKey(value) {
  if (!value) return "";
  return value.length <= 8 ? "****" : `${value.slice(0, 4)}...${value.slice(-4)}`;
}

function openDatabase(file, options = {}) {
  if (!file) return null;
  try {
    return new Database(file, options);
  } catch {
    return null;
  }
}

export function createAuthStore(env = process.env) {
  const kapsulePath = env.GNOSIS_KAPSULE_DB || env.KAPSULE_DB;
  const claimLensPath = env.GNOSIS_CLAIMLENS_DB || env.CLAIMLENS_DB;
  const keySecret = env.GNOSIS_KEY_ENCRYPTION_SECRET || env.CLAIMLENS_KEY_ENCRYPTION_SECRET || "";
  const secureCookies = env.NODE_ENV === "production" || env.GNOSIS_SECURE_COOKIES === "1";

  function withKapsule(callback) {
    const db = openDatabase(kapsulePath, { readonly: true, fileMustExist: true });
    if (!db) return null;
    try {
      if (!db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'").get()) {
        return null;
      }
      return callback(db);
    } finally {
      db.close();
    }
  }

  function withClaimLens(callback) {
    const db = openDatabase(claimLensPath);
    if (!db) return null;
    try {
      return callback(db);
    } finally {
      db.close();
    }
  }

  function getSession(req) {
    const token = parseCookieHeader(req.get("cookie"))[SESSION_COOKIE];
    if (!token) return null;
    return withClaimLens((db) => {
      const row = db
        .prepare(
          `SELECT sessions.user_id, users.email, sessions.csrf_token
           FROM sessions INNER JOIN users ON users.id = sessions.user_id
           WHERE sessions.token_hash = ? AND sessions.expires_at > CURRENT_TIMESTAMP
             AND users.is_active = 1`,
        )
        .get(sha256(token));
      return row ? { ...row, token } : null;
    });
  }

  function authenticate(email, password, userAgent) {
    const normalized = normalizeEmail(email);
    const account = withKapsule((db) =>
      db.prepare("SELECT id, email, password_hash FROM users WHERE email = ?").get(normalized),
    );
    if (!account || !scryptPasswordMatches(password, account.password_hash)) return null;

    return withClaimLens((db) => {
      let user = db.prepare("SELECT id, email, display_name FROM users WHERE email = ?").get(normalized);
      if (!user) {
        const result = db
          .prepare(
            `INSERT INTO users (email, password_hash, display_name)
             VALUES (?, ?, ?)`,
          )
          .run(normalized, `kapsule:${account.id}`, normalized);
        user = db.prepare("SELECT id, email, display_name FROM users WHERE id = ?").get(result.lastInsertRowid);
      }

      const token = crypto.randomBytes(32).toString("base64url");
      const csrfToken = crypto.randomBytes(24).toString("base64url");
      const expires = new Date(Date.now() + SESSION_DAYS * 86_400_000)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      db.prepare(
        `INSERT INTO sessions (user_id, token_hash, csrf_token, expires_at)
         VALUES (?, ?, ?, ?)`,
      ).run(user.id, sha256(token), csrfToken, expires);
      return { id: user.id, email: user.email, displayName: user.display_name, token, csrfToken, userAgent };
    });
  }

  function hasOpenAiKey(userId) {
    return Boolean(
      withClaimLens((db) =>
        db
          .prepare("SELECT provider FROM user_api_keys WHERE user_id = ? AND provider = 'openai'")
          .get(userId),
      ),
    );
  }

  function getOpenAiKeyMeta(userId) {
    return withClaimLens((db) =>
      db
        .prepare(
          `SELECT masked_value, updated_at FROM user_api_keys
           WHERE user_id = ? AND provider = 'openai'`,
        )
        .get(userId) || null,
    );
  }

  function resolveOpenAiKey(userId, requestKey) {
    const direct = String(requestKey || "").trim();
    if (direct) return { value: direct, source: "request" };
    if (userId == null) return { value: null, source: "none" };
    const row = withClaimLens((db) =>
      db.prepare("SELECT encrypted_value FROM user_api_keys WHERE user_id = ? AND provider = 'openai'").get(userId),
    );
    const value = row ? decryptClaimLensSecret(row.encrypted_value, keySecret) : null;
    return { value, source: value ? "saved" : "none" };
  }

  function saveOpenAiKey(userId, value) {
    const clean = String(value || "").trim();
    if (!clean) throw new Error("La cle OpenAI est vide.");
    const encrypted = encryptClaimLensSecret(clean, keySecret);
    const fingerprint = sha256(clean).slice(0, 16);
    withClaimLens((db) => {
      db.prepare(
        `INSERT INTO user_api_keys
           (user_id, provider, encrypted_value, key_fingerprint, masked_value)
         VALUES (?, 'openai', ?, ?, ?)
         ON CONFLICT(user_id, provider) DO UPDATE SET
           encrypted_value = excluded.encrypted_value,
           key_fingerprint = excluded.key_fingerprint,
           masked_value = excluded.masked_value,
           updated_at = CURRENT_TIMESTAMP`,
      ).run(userId, encrypted, fingerprint, maskedKey(clean));
    });
  }

  function setSessionCookie(res, token, maxAge = SESSION_DAYS * 86_400) {
    res.append("Set-Cookie", `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax${secureCookies ? "; Secure" : `; Max-Age=${maxAge}`}`);
  }

  function clearSessionCookie(res) {
    res.append("Set-Cookie", `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secureCookies ? "; Secure" : ""}`);
  }

  function setGuestCookie(res, token) {
    res.append("Set-Cookie", `${GUEST_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax${secureCookies ? "; Secure" : `; Max-Age=2592000`}`);
  }

  function logout(req, res) {
    const cookies = parseCookieHeader(req.get("cookie"));
    const token = cookies[SESSION_COOKIE];
    if (token) {
      withClaimLens((db) => {
        db.prepare("DELETE FROM sessions WHERE token_hash = ?").run(sha256(token));
      });
    }
    clearSessionCookie(res);
  }

  function owner(req, res) {
    const session = getSession(req);
    if (session) return { type: "user", id: String(session.user_id), session };
    const cookies = parseCookieHeader(req.get("cookie"));
    const guest = cookies[GUEST_COOKIE] || crypto.randomBytes(24).toString("base64url");
    if (!cookies[GUEST_COOKIE]) setGuestCookie(res, guest);
    return { type: "guest", id: sha256(guest), guest };
  }

  return {
    authenticate,
    clearSessionCookie,
    getOpenAiKeyMeta,
    getSession,
    hasOpenAiKey,
    keySecretConfigured: Boolean(keySecret),
    logout,
    owner,
    resolveOpenAiKey,
    saveOpenAiKey,
    setSessionCookie,
    setGuestCookie,
  };
}

export { GUEST_COOKIE, SESSION_COOKIE, decryptClaimLensSecret, encryptClaimLensSecret, maskedKey };
