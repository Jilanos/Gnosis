## item_018_remplacer_le_quota_de_fiches_par_un_contrat_de_granularite_automatique - Remplacer le quota de fiches par un contrat de granularite automatique
> From version: 1.1.9
> Schema version: 1.0
> Status: Done
> Understanding: 90%
> Confidence: 85%
> Progress: 100%
> Complexity: High
> Theme: Pipeline pedagogique
> Reminder: Update status/understanding/confidence/progress and linked request/task references when you edit this doc.

# Problem
- targetCards contraint le plan avant que la couverture pedagogique soit evaluee.
- Les prompts et le mock ne distinguent pas suffisamment objectif autonome, prerequis indispensable et extension decorative.

# Scope
- In:
  - Retirer targetCards du contrat API et du pipeline.
  - Definir une planification fondee sur la couverture, la dependance, la non-redondance et le niveau choisi.
  - Ajouter une justification structuree pour chaque prerequis ou notion ajoutee, et un bilan de plan.
  - Adapter le mock, les schemas, les validateurs et les tests.
- Out:
  - Ajouter un reglages manuel de volume ou de duree.
  - Modifier le format Kapsule en dehors des champs necessaires a l'explication du plan.

# Acceptance criteria
- Le plan derive son nombre de fiches de la couverture utile et ne recoit aucun quota numerique.
- Chaque fiche planifiee declare son objectif, les notions couvertes et la raison de son autonomie.
- Les prerequis ajoutes sont limites aux dependances indispensables et motives; les extensions ecartees sont tracees.
- Les tests prouvent qu'aucun contenu n'est ajoute pour atteindre un volume predetermine.

# AC Traceability
- request-AC2 -> This backlog slice. Proof: Le plan derive son nombre de fiches de la couverture utile et ne recoit aucun quota numerique.
- request-AC3 -> This backlog slice. Proof: Chaque fiche planifiee declare son objectif, les notions couvertes et la raison de son autonomie.
- request-AC4 -> This backlog slice. Proof: Les prerequis ajoutes sont limites aux dependances indispensables et motives; les extensions ecartees sont tracees.
- request-AC6 -> This backlog slice. Proof: Les tests prouvent qu'aucun contenu n'est ajoute pour atteindre un volume predetermine.
- request-AC1 -> This backlog slice. Evidence needed: L'utilisateur choisit uniquement son niveau d'apprentissage (low, medium ou advanced); aucun nombre, budget ou curseur de fiches n'est expose ni requis.
- request-AC5 -> This backlog slice. Evidence needed: Le resultat expose un court bilan du plan : fiches retenues, notions fusionnees, prerequis ajoutes et raison pedagogique de chacun.

# Decision framing
- Product framing: Not needed
- Architecture framing: Not needed

# Links
- Product brief(s): `prod_007_generation_gnosis_pilotee_par_la_couverture_pedagogique`
- Architecture decision(s): (none yet)
- Request: `req_010_rendre_la_granularite_pedagogique_de_gnosis_entierement_automatique`
- Primary task(s): `task_011_livrer_la_generation_gnosis_a_granularite_automatique`

# AI Context
- Summary: Remplacer le quota de fiches par un contrat de granularite automatique
- Keywords: scaffolded-backlog, remplacer le quota de fiches par un contrat de granularite automatique, implementation-ready
- Use when: Implementing the scaffolded slice for Remplacer le quota de fiches par un contrat de granularite automatique.
- Skip when: The change belongs to another backlog slice.

# Priority
- Priority: High — le quota actuel incite directement a des fiches artificielles et contredit le principe produit.
- Rationale: Set by scaffold input or defaulted for grooming.

# Tasks
- `task_011_livrer_la_generation_gnosis_a_granularite_automatique`

# Notes
- Task `task_011_livrer_la_generation_gnosis_a_granularite_automatique` was finished via `logics-manager flow finish task` on 2026-08-07.
