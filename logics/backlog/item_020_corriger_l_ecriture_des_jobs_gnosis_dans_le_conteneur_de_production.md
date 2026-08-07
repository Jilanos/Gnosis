## item_020_corriger_l_ecriture_des_jobs_gnosis_dans_le_conteneur_de_production - Corriger l'ecriture des jobs Gnosis dans le conteneur de production
> From version: 1.2.0
> Schema version: 1.0
> Status: Done
> Understanding: 90%
> Confidence: 85%
> Progress: 100%
> Complexity: High
> Theme: Operator workflow and runtime integration
> Reminder: Update status/understanding/confidence/progress and linked request/task references when you edit this doc.

# Problem
Toute generation echoue en production avec `EACCES: permission denied, mkdir '/app/data'`; le service doit pouvoir persister ses jobs.

# Scope
- In:
  - Creer `/app/data` dans l'image runtime et le donner a l'utilisateur `node`.
  - Exclure `data` du contexte de build.
  - Verifier une generation complete dans un conteneur, avec volume monte.
- Out:
  - Changer le mecanisme de persistance des jobs ou son emplacement par defaut.
  - Modifier la configuration du VPS ou du reverse proxy.

# Acceptance criteria
- AC1: Une generation aboutit dans le conteneur de production, avec ou sans volume monte sur `/app/data`.
- AC2: Le repertoire de persistance des jobs existe dans l'image et appartient a l'utilisateur non-root qui execute le serveur.
- AC3: Le correctif est verifie sur une image construite, pas seulement en execution locale hors conteneur.

# AC Traceability
- request-AC1 -> This backlog slice. Proof: AC1: Une generation aboutit dans le conteneur de production, avec ou sans volume monte sur `/app/data`.
- request-AC2 -> This backlog slice. Proof: AC2: Le repertoire de persistance des jobs existe dans l'image et appartient a l'utilisateur non-root qui execute le serveur.
- request-AC3 -> This backlog slice. Proof: AC3: Le correctif est verifie sur une image construite, pas seulement en execution locale hors conteneur.

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
- Request: `req_011_corriger_l_ecriture_des_jobs_gnosis_dans_le_conteneur_de_production`
- Primary task(s): `task_012_corriger_l_ecriture_des_jobs_gnosis_dans_le_conteneur_de_production`

# AI Context
- Summary: Corriger l'ecriture des jobs Gnosis dans le conteneur de production
- Keywords: backlog-groom, request, corriger l'ecriture des jobs gnosis dans le conteneur de production, bounded slice
- Use when: Use when implementing or reviewing the delivery slice for Corriger l'ecriture des jobs Gnosis dans le conteneur de production.
- Skip when: Skip when the change is unrelated to this delivery slice or its linked request.

# Priority
- Priority: High
- Rationale: La generation est totalement indisponible en production tant que les jobs ne peuvent pas etre persistes.

# Notes
- Hybrid rationale: Derived from request `req_011_corriger_l_ecriture_des_jobs_gnosis_dans_le_conteneur_de_production` and kept bounded to one coherent delivery slice.
- Source file: `logics/request/req_011_corriger_l_ecriture_des_jobs_gnosis_dans_le_conteneur_de_production.md`.
- Generated locally by logics-manager.
- Task `task_012_corriger_l_ecriture_des_jobs_gnosis_dans_le_conteneur_de_production` was finished via `logics-manager flow finish task` on 2026-08-07.

# Tasks
- `task_012_corriger_l_ecriture_des_jobs_gnosis_dans_le_conteneur_de_production`
