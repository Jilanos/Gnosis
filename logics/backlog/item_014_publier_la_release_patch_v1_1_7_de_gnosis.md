## item_014_publier_la_release_patch_v1_1_7_de_gnosis - Publier la release patch v1.1.7 de Gnosis
> From version: 1.1.7
> Schema version: 1.0
> Status: Done
> Understanding: 90%
> Confidence: 85%
> Progress: 100%
> Complexity: High
> Theme: Operator workflow and runtime integration
> Reminder: Update status/understanding/confidence/progress and linked request/task references when you edit this doc.

# Problem
La version `1.1.6` de Gnosis est déployée alors que la documentation des assets Icones V3 publiés ; aucun changement runtime attend une publication.

# Scope
- In:
  - incrément patch `1.1.6` -> `1.1.7` dans `package.json`, la racine de `package-lock.json` et `CHANGELOG.md`
  - commit de préparation, push sur `main`, tag annoté `v1.1.7` et vérification du workflow release
- Out:
  - toute modification fonctionnelle : la release ne livre que le contenu déjà mergé

# Acceptance criteria
- AC1: La version passe de 1.1.6 à 1.1.7 dans toutes les surfaces canoniques du dépôt.
- AC2: Le commit de préparation est poussé sur `main` et le tag annoté `v1.1.7` pointe dessus.
- AC3: Le workflow release déclenché par le tag est vert de bout en bout (validate, publish, deploy, release).

# AC Traceability
- request-AC1 -> This backlog slice. Proof: AC1: The request states the bounded need for publier la release patch v1.1.7 de gnosis.
- request-AC2 -> This backlog slice. Proof: AC2: Scope boundaries and operator impact are explicit.
- request-AC3 -> This backlog slice. Proof: AC3: The request is ready to be promoted into a backlog slice.

# Decision framing
- Product framing: Not needed
- Product signals: (none detected)
- Product follow-up: No product brief follow-up is expected based on current signals.
- Architecture framing: Not needed
- Architecture signals: (none detected)
- Architecture follow-up: No architecture decision follow-up is expected based on current signals.

# Links
- Product brief(s): (none yet)
- Architecture decision(s): (none yet)
- Request: `req_007_publier_la_release_patch_v1_1_7_de_gnosis`
- Primary task(s): `task_008_publier_la_release_patch_v1_1_7_de_gnosis`

# AI Context
- Summary: Publier la release patch v1.1.7 de Gnosis
- Keywords: backlog-groom, request, publier la release patch v1.1.7 de gnosis, bounded slice
- Use when: Use when implementing or reviewing the delivery slice for Publier la release patch v1.1.7 de Gnosis.
- Skip when: Skip when the change is unrelated to this delivery slice or its linked request.

# Priority
- Priority: Medium
- Rationale: Livraison de contenu déjà mergé, sans risque fonctionnel nouveau.

# Notes
- Hybrid rationale: Derived from request `req_007_publier_la_release_patch_v1_1_7_de_gnosis` and kept bounded to one coherent delivery slice.
- Source file: `logics/request/req_007_publier_la_release_patch_v1_1_7_de_gnosis.md`.
- Generated locally by logics-manager.
- Task `task_008_publier_la_release_patch_v1_1_7_de_gnosis` was finished via `logics-manager flow finish task` on 2026-08-06.

# Tasks
- `task_008_publier_la_release_patch_v1_1_7_de_gnosis`
