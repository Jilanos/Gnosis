## task_004_orchestrer_la_remediation_de_l_audit_gnosis - Orchestrer la remediation de l'audit Gnosis
> From version: 0.1.0
> Schema version: 1.0
> Status: Done
> Understanding: 90%
> Confidence: 85%
> Progress: 100%
> Complexity: Medium
> Theme: Implementation delivery
> Reminder: Update status/understanding/confidence/progress and linked request/backlog references when you edit this doc.
> Owner: codex

# Context
- Orchestrate the scaffolded request chain and keep sibling implementation slices linked.

# Plan
- [ ] 1. Stabiliser les jobs
- [ ] 2. Borner la capacite et la CI
- [ ] 3. Finaliser contrat et quality gates
- [ ] ADR 009 checkpoint: update affected Logics docs during each meaningful wave and leave the repo commit-ready.
- [ ] Keep commit creation under operator control; do not force one commit per micro-step.
- [ ] GATE: do not close until lint, audit, and scaffold validation pass.

# Backlog
- `item_004_persister_les_jobs_de_generation_avec_annulation_et_progression`
- `item_005_proteger_la_capacite_de_generation_et_imposer_un_gate_pr`
- `item_006_clarifier_l_acces_et_renforcer_qualite_et_release`

# Definition of Done (DoD)
- [x] Generated request, product, backlog, and task docs are present.
- [x] Context-pack handoff is available when requested.
- [x] Validation passes.
- [x] Meaningful waves followed ADR 009: affected docs updated and the repo left commit-ready without automatic commits.

# AC Traceability
- request-AC1 -> This task. Proof: scaffold command generated the request-chain corpus.
- request-AC4 -> This task. Proof: optional context-pack handoff is supported.
- request-AC6 -> This task. Proof: dry-run and collision checks bound file changes.
- request-AC8 -> This task. Proof: CLI help documents the one-pass scaffold workflow.

# Validation
- Run `python3 -m logics_manager lint --require-status`.
- Run scaffold command tests.
- Finish workflow executed on 2026-07-25.
- Linked backlog/request close verification passed.

# Report
- Implementation complete.
- Finished on 2026-07-25.
- Linked backlog item(s): `item_004_persister_les_jobs_de_generation_avec_annulation_et_progression`, `item_005_proteger_la_capacite_de_generation_et_imposer_un_gate_pr`, `item_006_clarifier_l_acces_et_renforcer_qualite_et_release`
- Related request(s): `req_003_remedier_aux_constats_de_l_audit_technique_2026_07_25`

# AI Context
- Summary: Orchestrer la remediation de l'audit Gnosis
- Keywords: scaffolded-task, request-chain-scaffold, orchestration
- Use when: Coordinating implementation of a scaffolded request chain.
- Skip when: Working on one isolated sibling slice.

# Links
- Request: `req_003_remedier_aux_constats_de_l_audit_technique_2026_07_25`
- Product brief(s): `prod_002_fiabilisation_de_la_generation_gnosis`
- Architecture decision(s): (none yet)

# Notes
- Regle de cloture de la chaine: une fois les criteres d'acceptation valides, preparer la version 1.0.0, creer un commit atomique des changements Logics et code, puis pousser la branche et le commit. Attendre la fin de la CI; uniquement si elle est verte, creer et pousser le tag v1.0.0. Suivre le deploiement jusqu'a sa disponibilite et corriger tout incident ou regression avant de declarer la release terminee.
