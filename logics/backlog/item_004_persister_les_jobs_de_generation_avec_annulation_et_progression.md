## item_004_persister_les_jobs_de_generation_avec_annulation_et_progression - Persister les jobs de generation avec annulation et progression
> From version: 0.1.0
> Schema version: 1.0
> Status: Done
> Understanding: 90%
> Confidence: 85%
> Progress: 100%
> Complexity: High
> Theme: architecture
> Reminder: Update status/understanding/confidence/progress and linked request/task references when you edit this doc.

# Problem
- Les timeouts client et serveur divergent et les appels IA continuent apres abandon.

# Scope
- In:
  - Modele de job persistant
  - Annulation propagee
  - Progression reelle
  - Reprise et erreurs testees
- Out:
  - Refonte du moteur IA

# Acceptance criteria
- Un utilisateur peut annuler un job sans generation orpheline.
- La progression et l'etat final sont persistants et testes.

# AC Traceability
- request-La generation est testable sous charge et en echec. -> This backlog slice. Proof: Un utilisateur peut annuler un job sans generation orpheline.

# Decision framing
- Product framing: Not needed
- Architecture framing: Not needed

# Links
- Product brief(s): `prod_002_fiabilisation_de_la_generation_gnosis`
- Architecture decision(s): (none yet)
- Request: `req_003_remedier_aux_constats_de_l_audit_technique_2026_07_25`
- Primary task(s): `task_004_orchestrer_la_remediation_de_l_audit_gnosis`

# AI Context
- Summary: Persister les jobs de generation avec annulation et progression
- Keywords: scaffolded-backlog, persister les jobs de generation avec annulation et progression, implementation-ready
- Use when: Implementing the scaffolded slice for Persister les jobs de generation avec annulation et progression.
- Skip when: The change belongs to another backlog slice.

# Priority
- Priority: high
- Rationale: Set by scaffold input or defaulted for grooming.

# Notes
- Task `task_004_orchestrer_la_remediation_de_l_audit_gnosis` was finished via `logics-manager flow finish task` on 2026-07-25.
