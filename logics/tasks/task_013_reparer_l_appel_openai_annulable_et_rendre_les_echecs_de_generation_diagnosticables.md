## task_013_reparer_l_appel_openai_annulable_et_rendre_les_echecs_de_generation_diagnosticables - Reparer l'appel OpenAI annulable et rendre les echecs de generation diagnosticables
> From version: 1.2.1
> Schema version: 1.0
> Status: Done
> Understanding: 90%
> Confidence: 85%
> Progress: 100%
> Complexity: Medium
> Theme: Implementation delivery
> Reminder: Update status/understanding/confidence/progress and linked request/backlog references when you edit this doc.
> Owner: Claude
> Indicators reviewed: 2026-08-07

# Definition of Done (DoD)
- [x] The backlog scope is implemented.
- [x] Acceptance criteria are covered.
- [x] Validation passes.
- [x] Meaningful waves followed ADR 009: affected docs updated and the repo left commit-ready without automatic commits.

# Backlog
- `item_021_reparer_l_appel_openai_annulable_et_rendre_les_echecs_de_generation_diagnosticables`

# Acceptance criteria
- AC1: Une generation reelle avec une cle valide aboutit, y compris lorsqu'un signal d'annulation est fourni.
- AC2: Le signal d'annulation est transmis comme option de requete et n'apparait jamais dans le corps envoye a OpenAI.
- AC3: Un echec OpenAI remonte le statut et le message amont, tronques, dans l'erreur affichee.
- AC4: Les plafonds de duree serveur et client couvrent la duree reelle d'une generation complete.

# Plan
- [x] Isoler la cause: appel OpenAI direct avec `signal` dans le corps -> `HTTP 400 Unknown parameter: 'signal'`.
- [x] Transmettre le signal comme option de requete du SDK.
- [x] Remonter le statut et le message amont dans l'erreur de pipeline.
- [x] Aligner le plafond serveur (240 s) et le garde-fou client (30 min) sur la duree reelle mesuree.
- [x] Ajouter les tests de regression et rejouer un appel reel signale.

# AC Traceability
- request-AC1 -> This task. Proof: appel reel signale via `callStructured` avec une cle valide -> reponse `{"ok":true}` en 3 s; avant correctif, le meme appel renvoyait `HTTP 400 Unknown parameter: 'signal'`.
- request-AC2 -> This task. Proof: `src/server/openai-pipeline.mjs` passe `{ signal }` en second argument de `responses.create`; test `callStructured passes the abort signal as a request option, never in the body`.
- request-AC3 -> This task. Proof: `upstreamDetail` compose `HTTP <status> - <message>`; test `a failed OpenAI call reports the upstream status and message`.
- request-AC4 -> This task. Proof: `DEFAULT_OPENAI_TIMEOUT_MS` a 240 s et `GENERATION_TIMEOUT_MS` a 30 min, calibres sur une generation mesuree a 1244 s pour 20 fiches.

# Validation
- Diagnostic: job de production reproduit deux fois -> `OPENAI_REQUEST_FAILED` des l'etape Normalisation; sonde avec cle invalide -> echec en 3 s, donc l'egress du conteneur est sain.
- Cause confirmee hors application: `responses.create` avec `signal` dans le corps -> `400 unknown_parameter`.
- Correctif verifie par un appel reel signale (OK en 3 s) et par la generation complete du deck management (20 fiches, deck Kapsule valide, 1244 s).
- `npm test` : 28 tests, 28 pass. `npm run build` : OK.
- Cause isolee (HTTP 400 unknown_parameter 'signal'), correctif verifie par appel reel signale et generation complete du deck management; npm test 28/28, npm run build
- Finish workflow executed on 2026-08-07.
- Linked backlog/request close verification passed.

# Report
- Cause: `callStructured` envoyait `signal` dans le corps de la requete OpenAI; le job manager fournissant toujours un signal, toute generation reelle etait rejetee en HTTP 400 alors que le mock et les tests passaient.
- Effet de bord corrige: l'annulation d'un job atteint desormais reellement OpenAI.
- Diagnostic rendu possible depuis l'interface: le statut et le message amont sont remontes.
- Release 1.2.2 livree: correctif `3942fd7`, preparation `95f4d65`, CI verte, tag `v1.2.2`, workflow Release by tag 31204095122 success, `/api/health` renvoie `v1.2.2`.
- Verification en production apres deploiement: la generation reelle franchit Normalisation, Familles, Expansion, Plan puis 64% des fiches, et s'arrete sur `HTTP 429 - You have no credits remaining` remonte tel quel: le blocage restant est le credit du compte OpenAI, plus l'appel lui-meme.
- Finished on 2026-08-07.
- Linked backlog item(s): `item_021_reparer_l_appel_openai_annulable_et_rendre_les_echecs_de_generation_diagnosticables`
- Related request(s): `req_012_reparer_l_appel_openai_annulable_et_rendre_les_echecs_de_generation_diagnosticables`

# AI Context
- Summary: Implement reparer l'appel openai annulable et rendre les echecs de generation diagnosticables.
- Keywords: task, implementation, backlog, runtime, python
- Use when: You need a bounded implementation task for a backlog item.
- Skip when: The work is still at the request or backlog shaping stage.

# Links
- Request: `req_012_reparer_l_appel_openai_annulable_et_rendre_les_echecs_de_generation_diagnosticables`
- Product brief(s): (none yet)
- Architecture decision(s): (none yet)
