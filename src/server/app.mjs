import cors from "cors";
import express from "express";
import path from "node:path";
import { createJobManager } from "./jobs.mjs";
import { clampInteger, compactTopics } from "./utils.mjs";

const DEFAULT_RATE_LIMIT_WINDOW_MS = 60_000;
const DEFAULT_RATE_LIMIT_MAX = 20;

function parseCsv(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function corsOptions(env) {
  const allowedOrigins = parseCsv(env.CORS_ORIGIN);
  if (allowedOrigins.length > 0) {
    return {
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error("Origine CORS non autorisee."));
      },
    };
  }

  if (env.NODE_ENV === "production") {
    return { origin: false };
  }

  return {};
}

function createRateLimiter(env) {
  const windowMs = clampInteger(
    env.RATE_LIMIT_WINDOW_MS,
    1_000,
    3_600_000,
    DEFAULT_RATE_LIMIT_WINDOW_MS,
  );
  const maxRequests = clampInteger(env.RATE_LIMIT_MAX, 1, 1_000, DEFAULT_RATE_LIMIT_MAX);
  const buckets = new Map();
  let lastCleanup = 0;

  return function rateLimit(req, res, next) {
    const now = Date.now();
    if (now - lastCleanup > windowMs) {
      for (const [key, bucket] of buckets) {
        if (bucket.resetAt <= now) buckets.delete(key);
      }
      lastCleanup = now;
    }
    const key = req.ip || req.socket?.remoteAddress || "unknown";
    const current = buckets.get(key);
    if (!current || current.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    current.count += 1;
    if (current.count > maxRequests) {
      return res.status(429).json({ error: "Trop de generations demandees. Reessaie plus tard." });
    }
    return next();
  };
}

function shouldProtectServerKey(env, requestApiKey) {
  return (
    env.NODE_ENV === "production" &&
    env.GNOSIS_ALLOW_PUBLIC_API !== "1" &&
    Boolean(env.OPENAI_API_KEY) &&
    !requestApiKey
  );
}

function verifyAccessToken(req, env, requestApiKey) {
  if (!shouldProtectServerKey(env, requestApiKey)) return null;
  const expected = String(env.GNOSIS_ACCESS_TOKEN || "").trim();
  if (!expected) {
    return {
      status: 503,
      error: "Endpoint non public: configure GNOSIS_ACCESS_TOKEN ou fournis une cle OpenAI utilisateur.",
    };
  }
  const actual = String(req.get("x-gnosis-access-token") || "").trim();
  if (actual !== expected) {
    return { status: 401, error: "Acces non autorise pour utiliser la cle OpenAI serveur." };
  }
  return null;
}

function errorStatus(error) {
  if (error.validation) return 422;
  return error.status || 500;
}

export function createApp(env = process.env) {
  const app = express();
  const trustedProxy = Number(env.GNOSIS_TRUST_PROXY || 0);
  if (Number.isInteger(trustedProxy) && trustedProxy > 0) app.set("trust proxy", trustedProxy);
  const maxTopics = clampInteger(env.MAX_INPUT_TOPICS, 1, 200, 80);
  const maxCards = clampInteger(env.MAX_CARDS, 2, 100, 24);
  const rateLimit = createRateLimiter(env);
  const jobs = createJobManager(env);

  app.use(cors(corsOptions(env)));
  app.use(express.json({ limit: "256kb" }));
  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Content-Security-Policy", "default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; script-src 'self'; connect-src 'self'; frame-ancestors 'none'");
    next();
  });

  const staticDir = String(env.STATIC_DIR || "").trim();
  if (staticDir) {
    app.use(express.static(staticDir, { index: "index.html" }));
    app.get(/^(?!\/api(?:\/|$)).*/, (_req, res) => {
      res.sendFile(path.join(staticDir, "index.html"));
    });
  }

  app.get("/api/health", (_req, res) => {
    res.json({
      ok: true,
      model: env.OPENAI_MODEL || "gpt-5.6",
      mock: env.GNOSIS_MOCK_OPENAI === "1" || env.NODE_ENV === "test",
      hasServerApiKey: Boolean(env.OPENAI_API_KEY),
    });
  });

  app.post("/api/generate-deck", rateLimit, async (req, res) => {
    try {
      const topics = compactTopics(req.body?.topics, maxTopics);
      if (!topics.length) {
        return res.status(400).json({ error: "Ajoute au moins un sujet technique." });
      }

      const rawOptions = req.body?.options ?? {};
      const requestApiKey = String(req.body?.apiKey || "").trim();
      const accessError = verifyAccessToken(req, env, requestApiKey);
      if (accessError) {
        return res.status(accessError.status).json({ error: accessError.error });
      }
      const options = {
        title: String(rawOptions.title || "").trim(),
        language: rawOptions.language === "anglais" ? "anglais" : "francais",
        level: ["debutant", "intermediaire", "avance"].includes(rawOptions.level)
          ? rawOptions.level
          : "intermediaire",
        density: ["concise", "dense", "maximale"].includes(rawOptions.density)
          ? rawOptions.density
          : "dense",
        targetCards: clampInteger(rawOptions.targetCards, 2, maxCards, 8),
      };

      const requestEnv = requestApiKey ? { ...env, OPENAI_API_KEY: requestApiKey } : env;
      const job = await jobs.create({ topics, options, requestEnv });
      res.status(202).json(job);
    } catch (error) {
      const status = errorStatus(error);
      res.status(status).json({
        error: error.message,
        code: error.code,
        details: error.validation?.errors,
      });
    }
  });

  app.get("/api/generate-deck/:id", (req, res) => {
    const job = jobs.get(req.params.id);
    if (!job) return res.status(404).json({ error: "Job introuvable." });
    return res.json(job);
  });

  app.delete("/api/generate-deck/:id", async (req, res) => {
    const job = await jobs.cancel(req.params.id);
    if (!job) return res.status(404).json({ error: "Job introuvable." });
    return res.json(job);
  });

  void jobs.init();

  return app;
}
