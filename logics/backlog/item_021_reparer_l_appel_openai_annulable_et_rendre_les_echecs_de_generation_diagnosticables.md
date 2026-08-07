## item_021_reparer_l_appel_openai_annulable_et_rendre_les_echecs_de_generation_diagnosticables - Reparer l'appel OpenAI annulable et rendre les echecs de generation diagnosticables
> From version: 1.2.1
> Schema version: 1.0
> Status: Done
> Understanding: 90%
> Confidence: 85%
> Progress: 100%
> Complexity: High
> Theme: Operator workflow and runtime integration
> Reminder: Update status/understanding/confidence/progress and linked request/task references when you edit this doc.

# Problem
Toute generation reelle echoue: `L'appel OpenAI a echoue.` sans aucun detail exploitable.
L'utilisateur doit pouvoir generer un deck avec sa cle, et comprendre la cause quand un appel echoue.

# Scope
- In:
  - Transmettre le signal d'annulation comme option de requete du SDK OpenAI.
  - Remonter le statut et le message amont dans l'erreur de pipeline.
  - Aligner le plafond serveur par appel et le garde-fou client sur la duree reelle d'une generation.
  - Couvrir les deux comportements par des tests de regression.
- Out:
  - Changer le decoupage du pipeline ou le nombre d'appels au modele.
  - Introduire du streaming ou une reprise de generation partielle.

# Acceptance criteria
- AC1: Une generation reelle avec une cle valide aboutit, y compris lorsqu'un signal d'annulation est fourni.
- AC2: Le signal d'annulation est transmis comme option de requete et n'apparait jamais dans le corps envoye a OpenAI.
- AC3: Un echec OpenAI remonte le statut et le message amont, tronques, dans l'erreur affichee.
- AC4: Les plafonds de duree serveur et client couvrent la duree reelle d'une generation complete.

# AC Traceability
- request-AC1 -> This backlog slice. Proof: AC1: Une generation reelle avec une cle valide aboutit, y compris lorsqu'un signal d'annulation est fourni.
- request-AC2 -> This backlog slice. Proof: AC2: Le signal d'annulation est transmis comme option de requete et n'apparait jamais dans le corps envoye a OpenAI.
- request-AC3 -> This backlog slice. Proof: AC3: Un echec OpenAI remonte le statut et le message amont, tronques, dans l'erreur affichee.
- request-AC4 -> This backlog slice. Proof: AC4: Les plafonds de duree serveur et client couvrent la duree reelle d'une generation complete.

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
- Request: `req_012_reparer_l_appel_openai_annulable_et_rendre_les_echecs_de_generation_diagnosticables`
- Primary task(s): `task_013_reparer_l_appel_openai_annulable_et_rendre_les_echecs_de_generation_diagnosticables`

# AI Context
- Summary: Reparer l'appel OpenAI annulable et rendre les echecs de generation diagnosticables
- Keywords: backlog-groom, request, reparer l'appel openai annulable et rendre les echecs de generation diagnosticables, bounded slice
- Use when: Use when implementing or reviewing the delivery slice for Reparer l'appel OpenAI annulable et rendre les echecs de generation diagnosticables.
- Skip when: Skip when the change is unrelated to this delivery slice or its linked request.

# Priority
- Priority: High
- Rationale: Aucune generation reelle n'aboutit tant que l'appel est rejete par OpenAI.

# Notes
- Hybrid rationale: Derived from request `req_012_reparer_l_appel_openai_annulable_et_rendre_les_echecs_de_generation_diagnosticables` and kept bounded to one coherent delivery slice.
- Source file: `logics/request/req_012_reparer_l_appel_openai_annulable_et_rendre_les_echecs_de_generation_diagnosticables.md`.
- Generated locally by logics-manager.
- Task `task_013_reparer_l_appel_openai_annulable_et_rendre_les_echecs_de_generation_diagnosticables` was finished via `logics-manager flow finish task` on 2026-08-07.

# Tasks
- `task_013_reparer_l_appel_openai_annulable_et_rendre_les_echecs_de_generation_diagnosticables`
