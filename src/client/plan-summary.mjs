// Lecture cliente du bilan de planification renvoye par le pipeline.
// Le client n'invente aucun chiffre: il reformule ce que le plan declare.

export function planSummaryLines(plan) {
  const summary = plan?.summary;
  if (!summary) return [];

  const lines = [];
  for (const merged of summary.mergedTopics ?? []) {
    lines.push({
      kind: "fusion",
      label: merged.canonical,
      detail: `Fusionne ${(merged.aliases ?? []).join(", ")} — ${merged.reason}`,
    });
  }
  for (const prerequisite of summary.addedPrerequisites ?? []) {
    lines.push({
      kind: "prerequis",
      label: prerequisite.label,
      detail: `Requis pour ${prerequisite.requiredFor} — ${prerequisite.reason}`,
    });
  }
  for (const excluded of summary.excludedExtensions ?? []) {
    lines.push({
      kind: "ecarte",
      label: excluded.label,
      detail: excluded.reason,
    });
  }
  return lines;
}

export function planCardCount(plan) {
  return plan?.cards?.length ?? 0;
}

export function planRationale(plan) {
  return plan?.summary?.rationale ?? "";
}
