## item_005_proteger_la_capacite_de_generation_et_imposer_un_gate_pr - Proteger la capacite de generation et imposer un gate PR
> From version: 0.1.0
> Schema version: 1.0
> Status: Done
> Understanding: 90%
> Confidence: 85%
> Progress: 100%
> Complexity: Medium
> Theme: quality
> Reminder: Update status/understanding/confidence/progress and linked request/task references when you edit this doc.

# Problem
- Aucune CI PR et pas de limite de concurrence ou de debit adaptee a la generation couteuse.

# Scope
- In:
  - Limites de concurrence et files
  - Rate limit fiable derriere Caddy
  - CI PR lint test build
  - Tests de saturation
- Out:
  - Migration CI complete

# Acceptance criteria
- La capacite est bornee et observable.
- Une PR ne peut pas fusionner sans gate qualite.

# AC Traceability
- request-Les travaux critiques sont decomposes en lots executable. -> This backlog slice. Proof: La capacite est bornee et observable.

# Decision framing
- Product framing: Not needed
- Architecture framing: Not needed

# Links
- Product brief(s): `prod_002_fiabilisation_de_la_generation_gnosis`
- Architecture decision(s): (none yet)
- Request: `req_003_remedier_aux_constats_de_l_audit_technique_2026_07_25`
- Primary task(s): `task_004_orchestrer_la_remediation_de_l_audit_gnosis`

# AI Context
- Summary: Proteger la capacite de generation et imposer un gate PR
- Keywords: scaffolded-backlog, proteger la capacite de generation et imposer un gate pr, implementation-ready
- Use when: Implementing the scaffolded slice for Proteger la capacite de generation et imposer un gate PR.
- Skip when: The change belongs to another backlog slice.

# Priority
- Priority: high
- Rationale: Set by scaffold input or defaulted for grooming.

# Notes
- Task `task_004_orchestrer_la_remediation_de_l_audit_gnosis` was finished via `logics-manager flow finish task` on 2026-07-25.
