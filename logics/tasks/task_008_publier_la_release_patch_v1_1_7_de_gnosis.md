## task_008_publier_la_release_patch_v1_1_7_de_gnosis - Publier la release patch v1.1.7 de Gnosis
> From version: 1.1.7
> Schema version: 1.0
> Status: Done
> Understanding: 90%
> Confidence: 85%
> Progress: 100%
> Complexity: Medium
> Theme: Implementation delivery
> Reminder: Update status/understanding/confidence/progress and linked request/backlog references when you edit this doc.
> Owner: Claude

# Definition of Done (DoD)
- [x] The backlog scope is implemented.
- [x] Acceptance criteria are covered.
- [x] Validation passes.
- [x] Meaningful waves followed ADR 009: affected docs updated and the repo left commit-ready without automatic commits.

# Backlog
- `item_014_publier_la_release_patch_v1_1_7_de_gnosis`

# Acceptance criteria
- AC1: La version passe de 1.1.6 à 1.1.7 dans toutes les surfaces canoniques du dépôt.
- AC2: Le commit de préparation est poussé sur `main` et le tag annoté `v1.1.7` pointe dessus.
- AC3: Le workflow release déclenché par le tag est vert de bout en bout (validate, publish, deploy, release).

# Plan
- [x] Incrémenter `package.json`, la racine de `package-lock.json` et `CHANGELOG.md` de `1.1.6` vers `1.1.7`.
- [x] Créer le commit `Prepare ... v1.1.7` et le pousser sur `main`.
- [x] Créer et pousser le tag annoté `v1.1.7`.
- [x] Vérifier que les jobs validate, publish, deploy et release sont verts.

# Validation
- GitHub Actions release.yml passed on 2026-08-06: run 31112651131 green on validate, publish, deploy, release.
- Finish workflow executed on 2026-08-06.
- Linked backlog/request close verification passed.

# Report
- Commit de préparation: `3785090` sur `main`.
- Tag annoté: `v1.1.7`.
- Run release: https://github.com/Jilanos/Gnosis/actions/runs/31112651131 — succès (validate, publish, deploy, release).
- Contenu livré: la documentation des assets Icones V3 publiés ; aucun changement runtime.
- Finished on 2026-08-06.
- Linked backlog item(s): `item_014_publier_la_release_patch_v1_1_7_de_gnosis`
- Related request(s): `req_007_publier_la_release_patch_v1_1_7_de_gnosis`

# AI Context
- Summary: Implement publier la release patch v1.1.7 de gnosis.
- Keywords: task, implementation, backlog, runtime, python
- Use when: You need a bounded implementation task for a backlog item.
- Skip when: The work is still at the request or backlog shaping stage.

# Links
- Request: `req_007_publier_la_release_patch_v1_1_7_de_gnosis`
- Product brief(s): (none yet)
- Architecture decision(s): (none yet)

# AC Traceability
- request-AC1 -> This task. Proof: commit `3785090` incrémente toutes les surfaces canoniques vers `1.1.7`.
- request-AC2 -> This task. Proof: `3785090` est poussé sur `main` et le tag annoté `v1.1.7` pointe dessus.
- request-AC3 -> This task. Proof: run release https://github.com/Jilanos/Gnosis/actions/runs/31112651131 vert sur validate, publish, deploy et release.
