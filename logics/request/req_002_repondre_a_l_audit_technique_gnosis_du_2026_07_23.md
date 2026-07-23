## req_002_repondre_a_l_audit_technique_gnosis_du_2026_07_23 - Repondre a l'audit technique Gnosis du 2026-07-23
> From version: 0.1.0
> Schema version: 1.0
> Status: Done
> Understanding: 90%
> Confidence: 85%
> Complexity: High
> Theme: stability
> Reminder: Update status/understanding/confidence and linked backlog/task references when you edit this doc.

# Needs
- Repondre a `AUDIT.md` en traitant les risques bloquants signales sur les tests reels OpenAI: appels trop longs, crash sur JSON tronque, generation de deck trop volumineuse, modele par defaut a verifier, et endpoint serveur insuffisamment protege.
- Transformer l'audit en une chaine Logics tracable qui permet d'implementer, valider et cloturer les corrections avant une nouvelle campagne de tests reels.

# Context
- Source: `AUDIT.md`, date 2026-07-23, branche `main`, 7/7 tests verts en mode mock.
- Probleme prioritaire de l'audit: les appels OpenAI tres longs finissent par crasher pendant les tests reels.
- Les constats bloquants a couvrir sont: timeouts/retries absents, `fetch` frontend sans timeout, JSON OpenAI tronque non detecte, generation finale du deck en une seule reponse structuree, `max_output_tokens` absent, modele `gpt-5.6` a confirmer.
- Les constats importants a planifier sont: protection de `/api/generate-deck`, restriction CORS, routage d'erreur plus robuste, logs par etape, unification des schemas deck et progression UX.

# Acceptance criteria
- AC1: Les corrections bloquantes de `AUDIT.md` sections 1.1, 1.2 et 1.3 sont couvertes par le backlog et la task lies.
- AC2: Le travail inclut une validation explicite des tests mock existants et d'un comportement d'echec borne en cas d'appel OpenAI lent, incomplet ou invalide.
- AC3: Les points importants de securite, modele et qualite sont soit inclus dans la task, soit documentes comme limites restantes avec prochaine action.
- AC4: La cloture Logics conserve la preuve des commandes `lint`, `audit` et tests applicatifs executes.

# Definition of Ready (DoR)
- [x] Problem statement is explicit and user impact is clear.
- [x] Scope boundaries (in/out) are explicit.
- [x] Acceptance criteria are testable.
- [x] Dependencies and known risks are listed.

# Companion docs
- Product brief(s): (none yet)
- Architecture decision(s): (none yet)

# References
- `AUDIT.md`
- `app.mjs`
- `openai-pipeline.mjs`
- `src/main.jsx`
- `pipeline-schemas.mjs`
- `kapsule-schema.mjs`

# AI Context
- Summary: Repondre a l'audit technique Gnosis du 2026-07-23 en bornant les appels OpenAI, en gerant les sorties incompletes, en fractionnant la generation du deck et en cadrant les suites securite/qualite.
- Keywords: audit, openai-timeout, max-output-tokens, incomplete-response, json-tronque, cors, rate-limit, gnosis
- Use when: You need the root request for implementing the audit response.
- Skip when: The change is unrelated to `AUDIT.md` or to the pipeline de generation Gnosis.

# Backlog
- none
- `item_003_repondre_a_l_audit_technique_gnosis_du_2026_07_23`
