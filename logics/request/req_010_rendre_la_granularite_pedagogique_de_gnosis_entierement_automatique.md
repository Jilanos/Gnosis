## req_010_rendre_la_granularite_pedagogique_de_gnosis_entierement_automatique - Rendre la granularite pedagogique de Gnosis entierement automatique
> From version: 1.1.9
> Schema version: 1.0
> Status: Done
> Understanding: 90%
> Confidence: 85%
> Complexity: High
> Theme: Pedagogical generation
> Reminder: Update status/understanding/confidence and linked backlog/task references when you edit this doc.

# Needs
- Gnosis doit choisir automatiquement le nombre de fiches necessaires pour apprendre les notions saisies au niveau demande.
- Le niveau choisi est la seule intensite pedagogique explicite : low, medium ou advanced.
- Les prerequis et notions adjacentes ne peuvent etre ajoutes que lorsqu'ils sont indispensables a la comprehension; ils doivent etre justifies.
- Le contenu et le decoupage ne doivent jamais etre etires ou reduits pour satisfaire un nombre de fiches, une duree ou un volume arbitraire.

# Context
- L'API impose aujourd'hui targetCards avec une valeur par defaut de 8 et le pipeline demande explicitement ce nombre cible au modele.
- Le produit doit privilegier la couverture utile, la non-redondance et une granularite adaptee a chaque notion plutot qu'un volume predetermine.
- La sortie doit rester un deck Kapsule valide, progressif et exploitable.

# Acceptance criteria
- AC1: L'utilisateur choisit uniquement son niveau d'apprentissage (low, medium ou advanced); aucun nombre, budget ou curseur de fiches n'est expose ni requis.
- AC2: Le pipeline calcule un plan avec le nombre minimal de fiches necessaires a une couverture progressive des notions et de leurs prerequis indispensables.
- AC3: Chaque fiche correspond a un objectif d'apprentissage autonome, non redondant et relie a une notion saisie ou a un prerequis justifie.
- AC4: Le modele peut fusionner des sous-notions et peut refuser des extensions non necessaires; il ne remplit jamais un quota de fiches, de mots ou de duree.
- AC5: Le resultat expose un court bilan du plan : fiches retenues, notions fusionnees, prerequis ajoutes et raison pedagogique de chacun.
- AC6: Les validations et tests couvrent des cas simples, intermediaires et avances, y compris une notion unique, des notions redondantes et des prerequis requis.

# Definition of Ready (DoR)
- [x] Problem statement is explicit and user impact is clear.
- [x] Scope boundaries (in/out) are explicit.
- [x] Acceptance criteria are testable.
- [x] Dependencies and known risks are listed.

# Companion docs
- Product brief(s): `prod_007_generation_gnosis_pilotee_par_la_couverture_pedagogique`
- Architecture decision(s): (none yet)

# References
- src/client/main.jsx
- src/server/app.mjs
- src/server/openai-pipeline.mjs
- src/server/mock-pipeline.mjs
- src/server/card-metrics.mjs

# AI Context
- Summary: Rendre la granularite pedagogique de Gnosis entierement automatique
- Keywords: request-chain-scaffold, rendre la granularite pedagogique de gnosis entierement automatique, development-ready
- Use when: You need to implement or review the scaffolded workflow for Rendre la granularite pedagogique de Gnosis entierement automatique.
- Skip when: The change is unrelated to this scaffolded request chain.

# Backlog
- `item_018_remplacer_le_quota_de_fiches_par_un_contrat_de_granularite_automatique`
- `item_019_aligner_l_interface_gnosis_sur_le_niveau_et_le_bilan_pedagogique_automatiques`
