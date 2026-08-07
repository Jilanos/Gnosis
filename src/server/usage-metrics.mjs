// Consommation de tokens d'une generation. Sans cette mesure, aucune decision
// d'optimisation ne peut etre validee: les tokens de raisonnement sont factures
// alors qu'ils n'apparaissent nulle part dans le deck produit.

const EMPTY_TOTALS = {
  inputTokens: 0,
  cachedInputTokens: 0,
  outputTokens: 0,
  reasoningTokens: 0,
  totalTokens: 0,
  calls: 0,
};

export function readUsage(response) {
  const usage = response?.usage;
  if (!usage) return null;
  const inputTokens = Number(usage.input_tokens) || 0;
  const outputTokens = Number(usage.output_tokens) || 0;
  return {
    inputTokens,
    cachedInputTokens: Number(usage.input_tokens_details?.cached_tokens) || 0,
    outputTokens,
    reasoningTokens: Number(usage.output_tokens_details?.reasoning_tokens) || 0,
    totalTokens: Number(usage.total_tokens) || inputTokens + outputTokens,
    calls: 1,
  };
}

function add(target, entry) {
  for (const key of Object.keys(EMPTY_TOTALS)) {
    target[key] += entry[key] ?? 0;
  }
  return target;
}

export function createUsageCollector() {
  const stages = new Map();
  const totals = { ...EMPTY_TOTALS };

  return {
    record(stage, usage) {
      if (!usage) return null;
      const name = stage || "Inconnu";
      if (!stages.has(name)) stages.set(name, { ...EMPTY_TOTALS });
      add(stages.get(name), usage);
      add(totals, usage);
      return this.snapshot();
    },
    get totalTokens() {
      return totals.totalTokens;
    },
    snapshot() {
      return {
        stages: [...stages.entries()].map(([name, values]) => ({ name, ...values })),
        totals: { ...totals },
      };
    },
  };
}
