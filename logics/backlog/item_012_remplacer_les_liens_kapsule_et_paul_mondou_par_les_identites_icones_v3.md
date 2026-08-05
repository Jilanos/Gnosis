## item_012_remplacer_les_liens_kapsule_et_paul_mondou_par_les_identites_icones_v3 - Remplacer les liens Kapsule et Paul Mondou par les identites Icones V3
> From version: 1.1.5
> Schema version: 1.0
> Status: Done
> Understanding: 90%
> Confidence: 85%
> Progress: 100%
> Complexity: Medium
> Theme: Navigation
> Reminder: Update status/understanding/confidence/progress and linked request/task references when you edit this doc.

# Problem
- Les liens vers Kapsule et Paul Mondou doivent etre visuellement coherents avec le nouveau systeme d'icones.

# Scope
- In:
  - Localiser les liens Kapsule et Paul Mondou dans la navigation, le header ou le footer.
  - Copier les assets Kapsule et Paul Mondou necessaires depuis Icones V3.
  - Preserver les URL, libelles accessibles et etats clavier.
- Out:
  - Ajouter de nouveaux liens enfants non demandes.
  - Modifier le comportement de generation ou d'export vers Kapsule.

# Acceptance criteria
- AC1: Le lien Kapsule utilise un visuel Kapsule Icones V3 et conserve sa destination.
- AC2: Le lien Paul Mondou utilise un visuel Paul Mondou Icones V3 et conserve sa destination.
- AC3: Les liens restent accessibles, lisibles et verifies sur mobile et desktop.

# AC Traceability
- request-AC3 -> This backlog slice. Proof: AC1: Le lien Kapsule utilise un visuel Kapsule Icones V3 et conserve sa destination.
- request-AC4 -> This backlog slice. Proof: AC2: Le lien Paul Mondou utilise un visuel Paul Mondou Icones V3 et conserve sa destination.
- request-AC5 -> This backlog slice. Proof: AC3: Les liens restent accessibles, lisibles et verifies sur mobile et desktop.

# Decision framing
- Product framing: Not needed
- Architecture framing: Not needed

# Links
- Product brief(s): `prod_004_identite_gnosis_alignee_sur_icones_v3`
- Architecture decision(s): (none yet)
- Request: `req_005_integrer_les_icones_icones_v3_et_les_liens_kapsule_paul_mondou_dans_gnosis`
- Primary task(s): `task_006_orchestrer_l_integration_icones_v3_dans_gnosis`

# AI Context
- Summary: Remplacer les liens Kapsule et Paul Mondou par les identites Icones V3
- Keywords: scaffolded-backlog, remplacer les liens kapsule et paul mondou par les identites icones v3, implementation-ready
- Use when: Implementing the scaffolded slice for Remplacer les liens Kapsule et Paul Mondou par les identites Icones V3.
- Skip when: The change belongs to another backlog slice.

# Priority
- Priority: High - les liens transverses structurent le parcours entre applications
- Rationale: Set by scaffold input or defaulted for grooming.

# Tasks
- `task_006_orchestrer_l_integration_icones_v3_dans_gnosis`

# Notes
- Task `task_006_orchestrer_l_integration_icones_v3_dans_gnosis` was finished via `logics-manager flow finish task` on 2026-08-05.
