## item_003_repondre_a_l_audit_technique_gnosis_du_2026_07_23 - Repondre a l'audit technique Gnosis du 2026-07-23
> From version: 0.1.0
> Schema version: 1.0
> Status: Done
> Understanding: 90%
> Confidence: 85%
> Progress: 100%
> Complexity: High
> Theme: Operator workflow and runtime integration
> Reminder: Update status/understanding/confidence/progress and linked request/task references when you edit this doc.

# Problem
Les tests mock passent, mais `AUDIT.md` identifie un risque bloquant pour les tests reels: le pipeline peut cumuler plusieurs appels OpenAI non bornes, produire un JSON tronque, laisser la requete HTTP ouverte trop longtemps et exposer un endpoint serveur insuffisamment protege.

Ce backlog item regroupe la premiere tranche de reponse audit: rendre les echecs OpenAI bornes, comprehensibles et testables, puis cadrer les suites de securite et qualite.

# Scope
- In:
  - ajouter des timeouts et retries explicites au client OpenAI
  - ajouter un timeout frontend via `AbortController`
  - detecter `response.status === "incomplete"` et transformer le JSON tronque en erreur actionnable
  - fixer un budget `max_output_tokens`
  - reduire le risque de generation geante en fractionnant ou en preparant le fractionnement par fiche/lot
  - verifier ou rendre configurable le modele OpenAI par defaut
  - proteger le serveur au minimum contre l'usage ouvert de `/api/generate-deck` et cadrer CORS
  - mettre a jour les tests et preuves de validation
- Out:
  - refonte complete SSE/streaming si elle n'est pas necessaire pour corriger le crash
  - redesign UI hors messages d'erreur/progression minimale
  - nouvelle architecture produit non demandee par l'audit

# Acceptance criteria
- AC1: Chaque appel OpenAI a un timeout explicite, un nombre de retries explicite et une erreur serveur lisible en cas de depassement.
- AC2: Le frontend annule proprement une generation trop longue et affiche un message exploitable au lieu d'un spinner indefini.
- AC3: `parseOutput` detecte les reponses OpenAI incompletes et les JSON invalides/tronques sans remonter une `SyntaxError` brute.
- AC4: La generation du deck n'est plus un appel final non borne: `max_output_tokens` est fixe et le plan de fractionnement par fiche/lot est implemente ou explicitement prepare dans le code avec tests.
- AC5: Le modele par defaut est confirme comme utilisable ou remplace par une configuration documentee.
- AC6: `/api/generate-deck` n'est pas laisse comme proxy OpenAI ouvert en configuration de production, et CORS est restreint hors developpement.
- AC7: Les tests applicatifs, `logics-manager lint --require-status` et `logics-manager audit --group-by-doc` passent avant closeout.

# AC Traceability
- request-AC1 -> This backlog slice. Proof: AC1, AC3, AC4 cover audit sections 1.1, 1.2 and 1.3.
- request-AC2 -> This backlog slice. Proof: AC1, AC2, AC3 and AC7 require bounded failures and test evidence.
- request-AC3 -> This backlog slice. Proof: AC5 and AC6 cover model/security; remaining UX/quality can be documented at closeout if deferred.
- request-AC4 -> This backlog slice. Proof: AC7 requires command and test evidence before closeout.

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
- Request: `req_002_repondre_a_l_audit_technique_gnosis_du_2026_07_23`
- Primary task(s): `task_003_repondre_a_l_audit_technique_gnosis_du_2026_07_23`

# AI Context
- Summary: Repondre a l'audit technique Gnosis du 2026-07-23
- Keywords: backlog-groom, request, repondre a l'audit technique gnosis du 2026-07-23, bounded slice
- Use when: Use when implementing or reviewing the delivery slice for Repondre a l'audit technique Gnosis du 2026-07-23.
- Skip when: Skip when the change is unrelated to this delivery slice or its linked request.

# Priority
- Priority: High
- Rationale: `AUDIT.md` marks the OpenAI timeout, truncated JSON and oversized deck generation issues as blocking for real API tests.

# Notes
- Hybrid rationale: Derived from request `req_002_repondre_a_l_audit_technique_gnosis_du_2026_07_23` and kept bounded to the audit response needed before real OpenAI test campaigns.
- Source file: `logics/request/req_002_repondre_a_l_audit_technique_gnosis_du_2026_07_23.md`.
- Audit source: `AUDIT.md`.
- Task `task_003_repondre_a_l_audit_technique_gnosis_du_2026_07_23` was finished via `logics-manager flow finish task` on 2026-07-23.

# Tasks
- `task_003_repondre_a_l_audit_technique_gnosis_du_2026_07_23`
