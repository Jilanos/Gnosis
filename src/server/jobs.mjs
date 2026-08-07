import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { generateDeckPipeline } from "./openai-pipeline.mjs";

const DEFAULT_MAX_RUNNING = 2;
const DEFAULT_MAX_QUEUE = 8;

function numberSetting(value, fallback, min, max) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(min, Math.min(Math.trunc(parsed), max)) : fallback;
}

export function createJobManager(env = process.env) {
  const file = path.resolve(env.GNOSIS_JOBS_FILE || "data/gnosis-jobs.json");
  const persistent = env.NODE_ENV !== "test";
  const maxRunning = numberSetting(env.GNOSIS_MAX_RUNNING_JOBS, DEFAULT_MAX_RUNNING, 1, 8);
  const maxQueue = numberSetting(env.GNOSIS_MAX_QUEUED_JOBS, DEFAULT_MAX_QUEUE, 0, 100);
  const jobs = new Map();
  let running = 0;

  async function persist() {
    if (!persistent) return;
    await fs.mkdir(path.dirname(file), { recursive: true });
    const snapshot = [...jobs.values()].map(({ controller, requestEnv, ...job }) => job);
    const temporary = `${file}.${process.pid}.tmp`;
    await fs.writeFile(temporary, JSON.stringify(snapshot, null, 2));
    await fs.rename(temporary, file);
  }

  async function restore() {
    if (!persistent) return;
    try {
      const saved = JSON.parse(await fs.readFile(file, "utf8"));
      for (const job of saved) {
        if (["queued", "running"].includes(job.status)) {
          job.status = "failed";
          job.error = "Le processus a ete interrompu avant la fin du job.";
        }
        jobs.set(job.id, job);
      }
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }

  function publicJob(job) {
    const { controller, requestEnv, ...safe } = job;
    return safe;
  }

  function belongsTo(job, owner) {
    return !owner || job.owner?.type === owner.type && job.owner.id === owner.id;
  }

  async function pump() {
    while (running < maxRunning) {
      const job = [...jobs.values()].find((candidate) => candidate.status === "queued");
      if (!job) return;
      running += 1;
      job.status = "running";
      job.startedAt = new Date().toISOString();
      await persist();
      run(job).finally(() => {
        running -= 1;
        void pump();
      });
    }
  }

  async function run(job) {
    try {
      const result = await generateDeckPipeline({
        topics: job.topics,
        options: job.options,
        env: job.requestEnv || env,
        signal: job.controller.signal,
        onProgress(stage, progress) {
          job.stage = stage;
          job.progress = progress;
          void persist();
        },
        // La consommation est attachee au job au fil de l'eau: un job echoue ou
        // annule doit garder la trace de ce qui a deja ete paye.
        onUsage(usage) {
          job.usage = usage;
        },
      });
      job.status = "completed";
      job.progress = 100;
      job.stage = "Termine";
      job.result = result;
    } catch (error) {
      job.status = job.controller.signal.aborted ? "cancelled" : "failed";
      job.error = error.message || "Generation impossible.";
      job.code = error.code;
    } finally {
      job.finishedAt = new Date().toISOString();
      await persist();
    }
  }

  return {
    async init() {
      await restore();
    },
    async create({ topics, options, requestEnv, owner }) {
      const queued = [...jobs.values()].filter((job) => ["queued", "running"].includes(job.status));
      if (queued.length >= maxRunning + maxQueue) {
        const error = new Error("La file de generation est pleine.");
        error.status = 503;
        error.code = "GENERATION_QUEUE_FULL";
        throw error;
      }
      const id = crypto.randomUUID();
      const job = {
        id,
        status: "queued",
        stage: "En file",
        progress: 0,
        topics,
        options,
        requestEnv,
        owner,
        createdAt: new Date().toISOString(),
        controller: new AbortController(),
      };
      jobs.set(id, job);
      await persist();
      void pump();
      return publicJob(job);
    },
    get(id, owner) {
      const job = jobs.get(id);
      return job && belongsTo(job, owner) ? publicJob(job) : null;
    },
    async cancel(id, owner) {
      const job = jobs.get(id);
      if (!job || !belongsTo(job, owner)) return null;
      if (["queued", "running"].includes(job.status)) {
        job.controller.abort();
        job.status = "cancelled";
        job.stage = "Annule";
        job.finishedAt = new Date().toISOString();
        await persist();
      }
      return publicJob(job);
    },
    limits: { maxRunning, maxQueue },
  };
}
