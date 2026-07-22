## item_002_construire_le_mvp_applicatif_gnosis - Construire le MVP applicatif Gnosis
> From version: 1.0.0
> Schema version: 1.0
> Status: Done
> Understanding: 90%
> Confidence: 85%
> Progress: 100%
> Complexity: High
> Theme: mvp
> Reminder: Update status/understanding/confidence/progress and linked request/task references when you edit this doc.

# Problem
Le depot contient le cadrage mais pas encore l'outil utilisable. Il faut livrer
un MVP executable qui transforme une liste de sujets en deck Kapsule via un
pipeline OpenAI serveur, avec validation et export.

# Scope
- In:
  - frontend React/Vite stylise
  - backend Express
  - pipeline OpenAI multi-etapes
  - mode mock sans cle API
  - validation Kapsule locale
  - tests et fixture de validation
- Out:
  - deploiement production
  - authentification utilisateur
  - stockage persistant des generations
  - import direct distant dans Kapsule

# Acceptance criteria
- AC1: L'application demarre localement avec `npm run dev`.
- AC2: L'API genere un deck valide en mode mock et orchestre OpenAI hors test.
- AC3: La page permet saisie, options, progression, apercu, copie et telechargement.
- AC4: Le schema Kapsule est valide localement.
- AC5: Tests et build passent.

# AC Traceability
- request-AC1 -> This backlog slice. Proof: frontend generation workflow.
- request-AC2 -> This backlog slice. Proof: Express API routes.
- request-AC3 -> This backlog slice. Proof: pipeline implementation.
- request-AC4 -> This backlog slice. Proof: Kapsule validator and export actions.
- request-AC5 -> This backlog slice. Proof: unit/API tests.
- request-AC6 -> This backlog slice. Proof: validation commands.

# Decision framing
- Product framing: Existing
- Product signals: `prod_001_gnosis_product_brief`
- Product follow-up: None for this implementation slice
- Architecture framing: Existing
- Architecture signals: `adr_001_gnosis_pipeline_openai_kapsule`
- Architecture follow-up: None for this implementation slice

# Links
- Product brief(s): `prod_001_gnosis_product_brief`
- Architecture decision(s): `adr_001_gnosis_pipeline_openai_kapsule`
- Request: `logics/request/req_001_construire_le_mvp_applicatif_gnosis.md`
- Primary task(s): `task_002_construire_le_mvp_applicatif_gnosis`

# AI Context
- Summary: Construire le MVP applicatif Gnosis
- Keywords: backlog-groom, gnosis, mvp, react, express, openai, kapsule
- Use when: Use when implementing or reviewing the delivery slice for Construire le MVP applicatif Gnosis.
- Skip when: Skip when the change is unrelated to this delivery slice or its linked request.

# Priority
- Priority: High
- Rationale: This slice turns the framed project into an executable MVP.

# Notes
- Source file: `logics/request/req_001_construire_le_mvp_applicatif_gnosis.md`.
- Generated locally by logics-manager, then groomed for the executable Gnosis MVP.
- Task `task_002_construire_le_mvp_applicatif_gnosis` was finished via `logics-manager flow finish task` on 2026-07-22.

# Tasks
- `task_002_construire_le_mvp_applicatif_gnosis`
