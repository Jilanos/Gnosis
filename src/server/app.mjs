import cors from "cors";
import express from "express";
import { generateDeckPipeline } from "./openai-pipeline.mjs";
import { clampInteger, compactTopics } from "./utils.mjs";

export function createApp(env = process.env) {
  const app = express();
  const maxTopics = clampInteger(env.MAX_INPUT_TOPICS, 1, 200, 80);
  const maxCards = clampInteger(env.MAX_CARDS, 2, 100, 24);

  app.use(cors());
  app.use(express.json({ limit: "256kb" }));

  app.get("/api/health", (_req, res) => {
    res.json({
      ok: true,
      model: env.OPENAI_MODEL || "gpt-5.6",
      mock: env.GNOSIS_MOCK_OPENAI === "1" || env.NODE_ENV === "test",
      hasServerApiKey: Boolean(env.OPENAI_API_KEY),
    });
  });

  app.post("/api/generate-deck", async (req, res) => {
    try {
      const topics = compactTopics(req.body?.topics, maxTopics);
      if (!topics.length) {
        return res.status(400).json({ error: "Ajoute au moins un sujet technique." });
      }

      const rawOptions = req.body?.options ?? {};
      const requestApiKey = String(req.body?.apiKey || "").trim();
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
      const result = await generateDeckPipeline({ topics, options, env: requestEnv });
      res.json(result);
    } catch (error) {
      const status = error.validation ? 422 : error.message.includes("OPENAI_API_KEY") ? 503 : 500;
      res.status(status).json({
        error: error.message,
        details: error.validation?.errors,
      });
    }
  });

  return app;
}
