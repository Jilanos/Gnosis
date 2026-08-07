## task_011_livrer_la_generation_gnosis_a_granularite_automatique - Livrer la generation Gnosis a granularite automatique
> From version: 1.1.9
> Schema version: 1.0
> Status: Done
> Understanding: 90%
> Confidence: 85%
> Progress: 100%
> Complexity: Medium
> Theme: Implementation delivery
> Reminder: Update status/understanding/confidence/progress and linked request/backlog references when you edit this doc.
> Owner: Claude
> Indicators reviewed: 2026-08-07

# Context
- Orchestrate the scaffolded request chain and keep sibling implementation slices linked.

# Plan
- [x] 1. Cadrer le contrat de planification pedagogique et ses invariants de couverture avec une ADR si une decision durable est necessaire. Aucune ADR ouverte: les deux slices declarent `Architecture framing: Not needed` et le contrat tient dans `src/server/plan-coverage.mjs` et `src/server/pipeline-schemas.mjs`.
- [x] 2. Implementer le contrat serveur, les schemas, le pipeline, le mock et les validations sans quota de fiches.
- [x] 3. Adapter l'interface au seul choix de niveau et afficher le bilan de planification.
- [x] 4. Ajouter les tests de non-remplissage, de fusion et de prerequis, puis verifier build, tests et parcours de generation.
- [x] 5. Documenter les preuves de livraison et preparer une release SemVer appropriee (1.2.0, minor: contrat API modifie sans rupture du format Kapsule).
- [x] ADR 009 checkpoint: update affected Logics docs during each meaningful wave and leave the repo commit-ready.
- [x] Keep commit creation under operator control; do not force one commit per micro-step.
- [x] GATE: do not close until lint, audit, and scaffold validation pass.

# Backlog
- `item_018_remplacer_le_quota_de_fiches_par_un_contrat_de_granularite_automatique`
- `item_019_aligner_l_interface_gnosis_sur_le_niveau_et_le_bilan_pedagogique_automatiques`

# Definition of Done (DoD)
- [x] Generated request, product, backlog, and task docs are present.
- [x] Context-pack handoff is available when requested.
- [x] Validation passes.
- [x] Meaningful waves followed ADR 009: affected docs updated and the repo left commit-ready without automatic commits.

# AC Traceability
- request-AC2, request-AC3, request-AC4, request-AC6 -> `item_018_remplacer_le_quota_de_fiches_par_un_contrat_de_granularite_automatique`. Proof: `targetCards` retire de `src/server/app.mjs`, `src/server/openai-pipeline.mjs` et `src/server/mock-pipeline.mjs`; planification de couverture dans `src/server/plan-coverage.mjs`; contrat de plan (origin, sourceTopic, autonomyReason, summary) dans `src/server/pipeline-schemas.mjs`; tests `test/pipeline.test.mjs` (fiche unique, fusion, prerequis, niveau avance, quota legacy ignore, plafond technique).
- request-AC1, request-AC5, request-AC6 -> `item_019_aligner_l_interface_gnosis_sur_le_niveau_et_le_bilan_pedagogique_automatiques`. Proof: champs Fiches ciblees et Densite retires de `src/client/main.jsx`; niveau seul controle de profondeur; panneau Bilan de planification et lecture du plan dans `src/client/plan-summary.mjs`; tests `test/plan-summary.test.mjs`.

# Validation
- `npm test` : 26 tests, 26 pass, 0 fail.
- `npm run build` : build Vite reussi.
- `npm run validate:sample` : Deck valide.
- Parcours de generation verifie en mock (`GNOSIS_MOCK_OPENAI=1`) : POST/GET `/api/generate-deck` renvoient un plan sans quota, avec `summary.addedPrerequisites` justifies et `level: medium` resolu en `intermediaire`.
- npm test (26 pass), npm run build, npm run validate:sample, parcours de generation mock verifie
- Finish workflow executed on 2026-08-07.
- Linked backlog/request close verification passed.

# Report
- Livraison implementee: contrat de granularite automatique cote serveur, pipeline, mock, schemas, interface et documentation.
- Release 1.2.0 livree: commit d'implementation `4caf778`, commit de preparation `3d72005`, push `af06d67..3d72005` sur main.
- CI verte sur `3d72005`: run 31198319575 (https://github.com/Jilanos/Gnosis/actions/runs/31198319575).
- Tag annote `v1.2.0` sur `3d72005`; workflow Release by tag 31198485576 success (build, deploy, release); `/api/health` renvoie `v1.2.0`.
- Preuves de release enregistrees dans `logics/release/evidence.jsonl` (7 portes, npm_package skipped).
- Docs produit et architecture alignes sur le niveau comme seule intensite pedagogique et sur le bilan de planification.
- Finished on 2026-08-07.
- Linked backlog item(s): `item_018_remplacer_le_quota_de_fiches_par_un_contrat_de_granularite_automatique`, `item_019_aligner_l_interface_gnosis_sur_le_niveau_et_le_bilan_pedagogique_automatiques`
- Related request(s): `req_010_rendre_la_granularite_pedagogique_de_gnosis_entierement_automatique`

# AI Context
- Summary: Livrer la generation Gnosis a granularite automatique
- Keywords: scaffolded-task, request-chain-scaffold, orchestration
- Use when: Coordinating implementation of a scaffolded request chain.
- Skip when: Working on one isolated sibling slice.

# Links
- Request: `req_010_rendre_la_granularite_pedagogique_de_gnosis_entierement_automatique`
- Product brief(s): `prod_007_generation_gnosis_pilotee_par_la_couverture_pedagogique`
- Architecture decision(s): (none yet)
