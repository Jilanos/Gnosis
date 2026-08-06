## task_009_remplacer_les_assets_gnosis_par_les_masters_icones_v3_corriges - Remplacer les assets Gnosis par les masters Icones V3 corriges
> From version: 1.1.7
> Schema version: 1.0
> Status: In progress
> Understanding: 90%
> Confidence: 85%
> Progress: 60%
> Complexity: Medium
> Theme: Implementation delivery
> Reminder: Update status/understanding/confidence/progress and linked request/backlog references when you edit this doc.
> Owner: Claude

# Context
- Orchestrate the scaffolded request chain and keep sibling implementation slices linked.

# Plan
- [ ] 1. Copier le master Gnosis sur les quatre emplacements embleme et icone.
- [ ] 2. Copier les masters Kapsule et Paul Mondou sur leurs huit emplacements.
- [ ] 3. Rebuilder le client et verifier que `dist/` reprend les nouveaux assets.
- [ ] 4. Controler le rendu dans les deux themes.
- [ ] 5. Preparer la version `1.1.7` -> `1.1.8` dans `package.json`, la racine de `package-lock.json` et `CHANGELOG.md`.
- [ ] 6. Committer `Prepare ... v1.1.8`, pousser sur `main` et attendre le CI vert sur ce commit.
- [ ] 7. Creer et pousser le tag annote `v1.1.8`, puis verifier les quatre jobs du workflow release.
- [ ] 8. Consigner SHA, tag et URL du run dans le closeout.
- [ ] ADR 009 checkpoint: update affected Logics docs during each meaningful wave and leave the repo commit-ready.
- [ ] Keep commit creation under operator control; do not force one commit per micro-step.
- [ ] GATE: do not close until lint, audit, and scaffold validation pass.

# Backlog
- `item_015_remplacer_les_douze_assets_client_gnosis`
- `item_016_publier_la_version_1_1_8_apres_remplacement_des_assets`

# Definition of Done (DoD)
- [ ] Generated request, product, backlog, and task docs are present.
- [ ] Context-pack handoff is available when requested.
- [ ] Validation passes.
- [ ] Meaningful waves followed ADR 009: affected docs updated and the repo left commit-ready without automatic commits.

# AC Traceability
- request-AC1, request-AC2, request-AC3, request-AC4 -> `item_015_remplacer_les_douze_assets_client_gnosis`. Proof deferred to slice closeout.
- request-AC5 -> `item_016_publier_la_version_1_1_8_apres_remplacement_des_assets`. Proof deferred to slice closeout.

# Validation
- (no validation recorded yet)

# Report
- Not started.

# AI Context
- Summary: Remplacer les assets Gnosis par les masters Icones V3 corriges
- Keywords: scaffolded-task, request-chain-scaffold, orchestration
- Use when: Coordinating implementation of a scaffolded request chain.
- Skip when: Working on one isolated sibling slice.

# Links
- Request: `req_008_remplacer_les_assets_gnosis_par_les_masters_icones_v3_corriges`
- Product brief(s): `prod_006_identite_gnosis_alignee_sur_icones_v3_corrige`
- Architecture decision(s): (none yet)
