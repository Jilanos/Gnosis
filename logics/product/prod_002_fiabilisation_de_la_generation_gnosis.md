## prod_002_fiabilisation_de_la_generation_gnosis - Fiabilisation de la generation Gnosis
> Date: 2026-07-25
> Status: Proposed
> Related request: `req_003_remedier_aux_constats_de_l_audit_technique_2026_07_25`
> Related backlog: `item_004_persister_les_jobs_de_generation_avec_annulation_et_progression`, `item_005_proteger_la_capacite_de_generation_et_imposer_un_gate_pr`, `item_006_clarifier_l_acces_et_renforcer_qualite_et_release`
> Related task: `task_004_orchestrer_la_remediation_de_l_audit_gnosis`
> Related architecture: (none yet)
> Reminder: Update status, linked refs, scope, decisions, success signals, and open questions when you edit this doc.

# Overview
Rendre la generation persistante, gouvernee et coherente avec son modele d'acces.

# Goals
- Jobs annulables
- Capacite bornee
- Contrat d'acces clair

# Non-goals
- Nouvelles fonctionnalites pedagogiques

# Scope and guardrails
- In: scaffolded request, product, backlog, orchestration task, validation, and handoff context.
- Out: unrelated workflow docs and implementation of generated tasks.

# Key product decisions
- Use structured input as the source of truth for generated docs.
- Keep generated write paths local and repo-bounded.

# Success signals
- Generated docs pass lint and audit without broad manual rewrites.
- Context-pack output can be handed to an implementation agent directly.

# References
- Product back-reference: `req_003_remedier_aux_constats_de_l_audit_technique_2026_07_25`
- Task back-reference: `task_004_orchestrer_la_remediation_de_l_audit_gnosis`
