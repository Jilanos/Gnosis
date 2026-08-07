## item_019_aligner_l_interface_gnosis_sur_le_niveau_et_le_bilan_pedagogique_automatiques - Aligner l'interface Gnosis sur le niveau et le bilan pedagogique automatiques
> From version: 1.1.9
> Schema version: 1.0
> Status: Done
> Understanding: 90%
> Confidence: 85%
> Progress: 100%
> Complexity: Medium
> Theme: Experience de generation
> Reminder: Update status/understanding/confidence/progress and linked request/task references when you edit this doc.

# Problem
- L'interface affiche et transmet un nombre cible de fiches, ce qui donne l'impression que le volume est une intention utilisateur.
- Les decisions de fusion, de prerequis et de granularite ne sont pas presentees de maniere suffisamment explicite.

# Scope
- In:
  - Supprimer le controle de nombre de fiches du formulaire et de ses etats associes.
  - Conserver un choix clair de niveau avec des libelles coherents low, medium et advanced.
  - Afficher le bilan du plan et les justifications produites par le pipeline.
  - Tester les parcours client pertinents.
- Out:
  - Ajouter des preferences de longueur, de temps de lecture ou de densite manuelles.
  - Changer l'identite visuelle generale de Gnosis.

# Acceptance criteria
- Le formulaire ne propose aucun nombre cible de fiches, budget ou densite manuelle.
- Le niveau est le seul controle de profondeur pedagogique visible et sa valeur est transmise au serveur.
- Le resultat explique de facon concise le nombre de fiches choisi et les adaptations de perimetre.
- Le client gere proprement une reponse sans fiche superflue et les informations de plan restent accessibles.

# AC Traceability
- request-AC1 -> This backlog slice. Proof: Le formulaire ne propose aucun nombre cible de fiches, budget ou densite manuelle.
- request-AC5 -> This backlog slice. Proof: Le niveau est le seul controle de profondeur pedagogique visible et sa valeur est transmise au serveur.
- request-AC6 -> This backlog slice. Proof: Le resultat explique de facon concise le nombre de fiches choisi et les adaptations de perimetre.
- request-AC2 -> This backlog slice. Evidence needed: Le pipeline calcule un plan avec le nombre minimal de fiches necessaires a une couverture progressive des notions et de leurs prerequis indispensables.
- request-AC3 -> This backlog slice. Evidence needed: Chaque fiche correspond a un objectif d'apprentissage autonome, non redondant et relie a une notion saisie ou a un prerequis justifie.
- request-AC4 -> This backlog slice. Evidence needed: Le modele peut fusionner des sous-notions et peut refuser des extensions non necessaires; il ne remplit jamais un quota de fiches, de mots ou de duree.

# Decision framing
- Product framing: Not needed
- Architecture framing: Not needed

# Links
- Product brief(s): `prod_007_generation_gnosis_pilotee_par_la_couverture_pedagogique`
- Architecture decision(s): (none yet)
- Request: `req_010_rendre_la_granularite_pedagogique_de_gnosis_entierement_automatique`
- Primary task(s): `task_011_livrer_la_generation_gnosis_a_granularite_automatique`

# AI Context
- Summary: Aligner l'interface Gnosis sur le niveau et le bilan pedagogique automatiques
- Keywords: scaffolded-backlog, aligner l'interface gnosis sur le niveau et le bilan pedagogique automatiques, implementation-ready
- Use when: Implementing the scaffolded slice for Aligner l'interface Gnosis sur le niveau et le bilan pedagogique automatiques.
- Skip when: The change belongs to another backlog slice.

# Priority
- Priority: High — l'interface ne doit plus exposer une commande qui contredit le comportement automatique attendu.
- Rationale: Set by scaffold input or defaulted for grooming.

# Tasks
- `task_011_livrer_la_generation_gnosis_a_granularite_automatique`

# Notes
- Task `task_011_livrer_la_generation_gnosis_a_granularite_automatique` was finished via `logics-manager flow finish task` on 2026-08-07.
