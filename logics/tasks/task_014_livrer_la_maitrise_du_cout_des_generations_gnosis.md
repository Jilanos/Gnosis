## task_014_livrer_la_maitrise_du_cout_des_generations_gnosis - Livrer la maitrise du cout des generations Gnosis
> From version: 1.2.2
> Schema version: 1.0
> Status: In progress
> Understanding: 90%
> Confidence: 85%
> Progress: 85%
> Complexity: Medium
> Theme: Implementation delivery
> Reminder: Update status/understanding/confidence/progress and linked request/backlog references when you edit this doc.
> Owner: Claude
> Indicators reviewed: 2026-08-07

# Context
- Orchestrate the scaffolded request chain and keep sibling implementation slices linked.

# Plan
- [x] 1. Instrumenter la consommation par etape et la remonter jusqu'a l'interface.
- [x] 2. Etablir la mesure de reference: deck management de 20 fiches capture avant optimisation (entree etape Fiches ~26 260 tokens sur 20 appels, sortie visible ~47 000 tokens).
- [x] 3. Appliquer les leviers: contexte d'expansion cible par lot, regroupement configurable, effort de raisonnement optionnel.
- [x] 4. Ajouter le budget configurable et son arret propre.
- [ ] 5. Mesurer le gain reel avant/apres sur une generation complete: BLOQUE, le compte OpenAI de test n'a plus de credit. Gain d'entree mesure hors ligne sur le plan reel; le cout de sortie et de raisonnement reste a mesurer.
- [x] 6. Preparer la release SemVer appropriee (1.3.0).
- [ ] ADR 009 checkpoint: update affected Logics docs during each meaningful wave and leave the repo commit-ready.
- [ ] Keep commit creation under operator control; do not force one commit per micro-step.
- [ ] GATE: do not close until lint, audit, and scaffold validation pass.

# Backlog
- `item_022_mesurer_la_consommation_de_tokens_de_chaque_etape_de_generation`
- `item_023_reduire_le_cout_d_une_generation_a_couverture_pedagogique_constante`

# Definition of Done (DoD)
- [ ] Generated request, product, backlog, and task docs are present.
- [ ] Context-pack handoff is available when requested.
- [ ] Validation passes.
- [ ] Meaningful waves followed ADR 009: affected docs updated and the repo left commit-ready without automatic commits.

# AC Traceability
- request-AC1, request-AC2 -> `item_022_mesurer_la_consommation_de_tokens_de_chaque_etape_de_generation`. Proof deferred to slice closeout.
- request-AC3, request-AC4, request-AC5, request-AC6 -> `item_023_reduire_le_cout_d_une_generation_a_couverture_pedagogique_constante`. Proof deferred to slice closeout.

# AC Traceability
- request-AC1 -> This task. Proof: `src/server/usage-metrics.mjs` agrege entree, entree en cache, sortie, raisonnement et nombre d'appels par etape; `callStructured` enregistre chaque appel sous son etape. Tests `test/usage.test.mjs`.
- request-AC2 -> This task. Proof: `usage` present dans le resultat de job et attache au job au fil de l'eau via `onUsage` dans `src/server/jobs.mjs`; panneau Consommation et consommation engagee en cas d'echec dans `src/client/main.jsx`. Aucun secret n'est journalise.
- request-AC3 -> This task. Partiellement verifie: l'entree de l'etape Fiches passe de ~26 260 a ~11 661 tokens (-56%) au defaut livre, et a ~6 626 tokens (-75%, -65% d'appels) avec `OPENAI_DECK_BATCH_SIZE=3`, mesure sur le plan reel du deck management. Le cout de sortie et de raisonnement n'est pas mesure: compte OpenAI sans credit. Reste ouvert.
- request-AC4 -> This task. Proof: aucun levier ne touche au nombre de fiches ni a la couverture; un lot doit renvoyer exactement les fiches planifiees (`minItems`/`maxItems`) et `DECK_INCOMPLETE` est leve sinon. Les planchers de mots deviennent des planchers de lisibilite, jamais des cibles.
- request-AC5 -> This task. Proof: `GNOSIS_TOKEN_BUDGET` et `createTokenBudget` arretent la generation avec `GENERATION_BUDGET_EXCEEDED` (HTTP 402) en conservant la consommation mesuree. Test dedie.
- request-AC6 -> This task. Proof: leviers et variables documentes dans `README.md` et `docs/architecture.md`, gains chiffres dans ce document.

# Validation
- `npm test` : 37 tests, 37 pass (dont 9 nouveaux sur la mesure, le budget et la reduction de contexte).
- `npm run build` et `npm run validate:sample` : OK.
- Image construite et testee: generation mock complete dans le conteneur, `usage` present dans le resultat.
- Mesure hors ligne sur le plan reel du deck management: entree de l'etape Fiches -56% au defaut livre, -75% avec des lots de 3 fiches.

# Report
- Livre: mesure de consommation par etape jusqu'a l'interface, contexte d'expansion cible par lot, budget de tokens avec arret propre, effort de raisonnement optionnel, garde-fou de lot complet, planchers de mots reconcilies avec le principe de non-remplissage.
- Deux leviers restent desactives par defaut car ils ne peuvent pas etre valides contre l'API sans credit: `OPENAI_DECK_BATCH_SIZE=3` et `OPENAI_REASONING_EFFORT`. Un parametre refuse par l'API ferait echouer chaque appel, comme la regression corrigee en 1.2.2.
- Release 1.3.0 livree: implementation `367dfda`, preparation `6c15d02`, CI 31212922855 verte, tag `v1.3.0`, Release by tag 31213127599 success, `/api/health` renvoie `v1.3.0`.
- Etape 5 non close: le gain de cout reel, domine par les tokens de sortie et de raisonnement, doit etre mesure sur une generation complete une fois le credit OpenAI retabli. La mesure est desormais instrumentee pour le faire sans travail supplementaire.

# AI Context
- Summary: Livrer la maitrise du cout des generations Gnosis
- Keywords: scaffolded-task, request-chain-scaffold, orchestration
- Use when: Coordinating implementation of a scaffolded request chain.
- Skip when: Working on one isolated sibling slice.

# Links
- Request: `req_013_maitriser_le_cout_des_appels_openai_d_une_generation_gnosis`
- Product brief(s): `prod_008_generation_gnosis_a_cout_maitrise`
- Architecture decision(s): (none yet)
