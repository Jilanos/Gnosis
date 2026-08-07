## task_012_corriger_l_ecriture_des_jobs_gnosis_dans_le_conteneur_de_production - Corriger l'ecriture des jobs Gnosis dans le conteneur de production
> From version: 1.2.0
> Schema version: 1.0
> Status: Done
> Understanding: 90%
> Confidence: 85%
> Progress: 100%
> Complexity: Medium
> Theme: Implementation delivery
> Reminder: Update status/understanding/confidence/progress and linked request/backlog references when you edit this doc.
> Owner: Claude

# Definition of Done (DoD)
- [x] The backlog scope is implemented.
- [x] Acceptance criteria are covered.
- [x] Validation passes.
- [x] Meaningful waves followed ADR 009: affected docs updated and the repo left commit-ready without automatic commits.

# Backlog
- `item_020_corriger_l_ecriture_des_jobs_gnosis_dans_le_conteneur_de_production`

# Acceptance criteria
- AC1: Une generation aboutit dans le conteneur de production, avec ou sans volume monte sur `/app/data`.
- AC2: Le repertoire de persistance des jobs existe dans l'image et appartient a l'utilisateur non-root qui execute le serveur.
- AC3: Le correctif est verifie sur une image construite, pas seulement en execution locale hors conteneur.

# Plan
- [x] Reproduire l'echec sur une image construite, avec un volume monte sur `/app/data`.
- [x] Creer `/app/data` dans l'etage runtime et l'attribuer a l'utilisateur `node`.
- [x] Exclure `data` du contexte de build Docker.
- [x] Verifier une generation complete dans le conteneur corrige.
- [x] Preparer la release patch 1.2.1.

# AC Traceability
- request-AC1 -> This task. Proof: sur l'image corrigee avec `-v gnosis-fix-data:/app/data`, `POST /api/generate-deck` puis `GET /api/generate-deck/:id` renvoient un job `completed` avec un deck de 3 fiches; l'image sans correctif echouait en `EACCES`.
- request-AC2 -> This task. Proof: `Dockerfile` cree `/app/data` et l'attribue a `node` avant `USER node`; `docker exec ... ls -la /app/data` montre `node node`.
- request-AC3 -> This task. Proof: verification faite sur deux images construites (`docker build`), avant et apres correctif, avec volume monte, et non en execution locale hors conteneur.

# Validation
- Reproduction: image sans correctif + `-v gnosis-bug-data:/app/data` -> `POST /api/generate-deck` renvoie `EACCES: permission denied, open '/app/data/gnosis-jobs.json.1.tmp'`.
- Correctif: image avec `RUN mkdir -p /app/data && chown node:node /app/data`, meme montage -> job `completed`, deck de 3 fiches, `/app/data` appartient a `node:node`.
- `npm test` : 26 tests, 26 pass. `npm run build` et `npm run validate:sample` : OK.
- Reproduction EACCES sur image sans correctif, generation completee sur image corrigee avec volume; npm test 26/26, npm run build, npm run validate:sample
- Finish workflow executed on 2026-08-07.
- Linked backlog/request close verification passed.

# Report
- Cause: l'etage runtime tourne en `USER node` alors que `/app` appartient a root et que `/app/data` n'existe pas; un volume monte sur ce chemin heritait donc d'un proprietaire root.
- Correctif limite a l'image: creation et attribution de `/app/data`, plus exclusion de `data` du contexte de build. Aucun changement du code serveur.
- Finished on 2026-08-07.
- Linked backlog item(s): `item_020_corriger_l_ecriture_des_jobs_gnosis_dans_le_conteneur_de_production`
- Related request(s): `req_011_corriger_l_ecriture_des_jobs_gnosis_dans_le_conteneur_de_production`

# AI Context
- Summary: Implement corriger l'ecriture des jobs gnosis dans le conteneur de production.
- Keywords: task, implementation, backlog, runtime, python
- Use when: You need a bounded implementation task for a backlog item.
- Skip when: The work is still at the request or backlog shaping stage.

# Links
- Request: `req_011_corriger_l_ecriture_des_jobs_gnosis_dans_le_conteneur_de_production`
- Product brief(s): (none yet)
- Architecture decision(s): (none yet)
