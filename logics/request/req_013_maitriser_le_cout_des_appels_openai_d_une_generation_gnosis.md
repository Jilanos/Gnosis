## req_013_maitriser_le_cout_des_appels_openai_d_une_generation_gnosis - Maitriser le cout des appels OpenAI d'une generation Gnosis
> From version: 1.2.2
> Schema version: 1.0
> Status: Draft
> Understanding: 90%
> Confidence: 85%
> Complexity: Medium
> Theme: Generation cost
> Reminder: Update status/understanding/confidence and linked backlog/task references when you edit this doc.

# Needs
- Une generation de deck doit avoir un cout previsible et proportionne; environ 2,87 USD ont ete consommes sur une journee dominee par un deck de 20 fiches.
- L'operateur doit voir ce que chaque generation consomme, avant de pouvoir arbitrer quoi que ce soit.
- Le cout doit baisser sans degrader la couverture pedagogique ni reintroduire un quota de fiches.

# Context
- Aucune donnee d'usage n'est collectee: `callStructured` ignore le champ `usage` renvoye par l'API Responses, donc le cout n'est ni mesure ni affiche.
- Le modele par defaut est un modele de raisonnement (gpt-5.6) et aucun niveau d'effort n'est demande; les tokens de raisonnement sont factures et invisibles dans le deck produit.
- `OPENAI_DECK_BATCH_SIZE` vaut 1 par defaut: un deck de 20 fiches declenche 20 appels de redaction, chacun repayant le contexte fixe.
- Mesure sur le deck management de 20 fiches: environ 26 000 tokens d'entree pour l'etape Fiches, dont environ 18 000 de pure redondance car l'objet `expansion` complet est renvoye a chaque appel, et environ 47 000 tokens de sortie visible.
- `max_output_tokens` vaut 12 000 par appel de fiche alors que les fiches produites font environ 1 000 mots.
- `card-metrics` vise 1500 a 1800 mots par fiche, ce qui pousse un volume de sortie eleve et entre en tension avec le principe de non-remplissage.

# Acceptance criteria
- AC1: Chaque generation expose sa consommation reelle par etape: tokens d'entree, de sortie, de raisonnement et total.
- AC2: La consommation est visible dans le resultat de generation et journalisee cote serveur, sans exposer de secret.
- AC3: Le cout d'une generation de reference baisse d'au moins 40 pour cent a couverture pedagogique constante, mesure avant/apres sur le meme jeu de notions.
- AC4: Aucune optimisation ne reduit le nombre de fiches, la couverture ou la qualite des fiches pour economiser des tokens.
- AC5: L'operateur peut borner une generation par un budget configurable, et un depassement arrete proprement le job avec un message explicite.
- AC6: Les leviers retenus et leurs gains mesures sont documentes.

# Definition of Ready (DoR)
- [x] Problem statement is explicit and user impact is clear.
- [x] Scope boundaries (in/out) are explicit.
- [x] Acceptance criteria are testable.
- [x] Dependencies and known risks are listed.

# Companion docs
- Product brief(s): `prod_008_generation_gnosis_a_cout_maitrise`
- Architecture decision(s): (none yet)

# References
- src/server/openai-pipeline.mjs
- src/server/jobs.mjs
- src/server/card-metrics.mjs
- src/client/main.jsx

# AI Context
- Summary: Maitriser le cout des appels OpenAI d'une generation Gnosis
- Keywords: request-chain-scaffold, maitriser le cout des appels openai d'une generation gnosis, development-ready
- Use when: You need to implement or review the scaffolded workflow for Maitriser le cout des appels OpenAI d'une generation Gnosis.
- Skip when: The change is unrelated to this scaffolded request chain.

# Backlog
- `item_022_mesurer_la_consommation_de_tokens_de_chaque_etape_de_generation`
- `item_023_reduire_le_cout_d_une_generation_a_couverture_pedagogique_constante`
