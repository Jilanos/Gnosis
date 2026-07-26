## item_008_integrer_gnosis_a_l_identite_commune_et_a_la_resolution_de_cle - Integrer Gnosis a l identite commune et a la resolution de cle
> From version: 1.0.0
> Schema version: 1.0
> Status: Done
> Understanding: 90%
> Confidence: 85%
> Progress: 100%
> Complexity: High
> Theme: Authentification et autorisation Gnosis
> Reminder: Update status/understanding/confidence/progress and linked request/task references when you edit this doc.

# Problem
- Gnosis accepte aujourd'hui un jeton partage expose manuellement et ne connait pas le proprietaire de ses jobs.
- Le pipeline doit resoudre la bonne cle sans persister une cle invitee.

# Scope
- In:
  - Utiliser l'authentification Kapsule existante et une session Gnosis securisee rattachee au meme compte.
  - Resoudre une cle invitee ponctuelle en priorite, puis la cle OpenAI commune de l'utilisateur connecte, sans fallback de cle serveur pour les utilisateurs.
  - Rattacher jobs, consultation et annulation a l'identite connectee ou invitee.
  - Retirer le champ GNOSIS_ACCESS_TOKEN et supprimer ou isoler le mecanisme serveur residuel.
- Out:
  - Creer une base de comptes Gnosis.
  - Persister des cles invitees ou les incorporer aux fichiers de jobs.
  - Autoriser un utilisateur a consommer la cle d'un autre compte.

# Acceptance criteria
- AC1: Une session Gnosis valide est liee a un compte Kapsule et les routes sensibles refusent les sessions absentes ou invalides selon le parcours concerne.
- AC2: Une generation connectee utilise une cle commune existante ; une generation invitee ou sans cle utilise seulement la cle saisie pour cette action.
- AC3: Les jobs ne divulguent ni la cle ni les donnees d'un autre proprietaire et les tests couvrent les acces croises.
- AC4: Aucun navigateur n'a besoin de connaitre GNOSIS_ACCESS_TOKEN.

# AC Traceability
- request-AC1 -> This backlog slice. Proof: AC1: Une session Gnosis valide est liee a un compte Kapsule et les routes sensibles refusent les sessions absentes ou invalides selon le parcours concerne.
- request-AC2 -> This backlog slice. Proof: AC2: Une generation connectee utilise une cle commune existante ; une generation invitee ou sans cle utilise seulement la cle saisie pour cette action.
- request-AC4 -> This backlog slice. Proof: AC3: Les jobs ne divulguent ni la cle ni les donnees d'un autre proprietaire et les tests couvrent les acces croises.
- request-AC5 -> This backlog slice. Proof: AC4: Aucun navigateur n'a besoin de connaitre GNOSIS_ACCESS_TOKEN.
- request-AC6 -> This backlog slice. Proof: AC4: Aucun navigateur n'a besoin de connaitre GNOSIS_ACCESS_TOKEN.
- request-AC7 -> This backlog slice. Evidence needed: L'en-tete de Gnosis affiche v<version de package.json> et contient un lien accessible vers https://paulmondou.fr/.
- request-AC8 -> This backlog slice. Evidence needed: La livraison contient un commit Logics, un commit d'implementation, une preparation SemVer, un commit de release, un push, une CI verte, un tag et une release correspondant exactement a la version publiee.
- request-AC9 -> This backlog slice. Evidence needed: Apres release, le deploiement est verifie par healthcheck, parcours de connexion et generation controlee, et son resultat est consigne.

# Decision framing
- Product framing: Not needed
- Architecture framing: Not needed

# Links
- Product brief(s): `prod_003_gnosis_avec_identite_commune_et_cle_openai_reutilisable`
- Architecture decision(s): (none yet)
- Request: `req_004_federer_gnosis_aux_comptes_communs_et_au_coffre_openai_partage`
- Primary task(s): `task_005_orchestrer_l_identite_commune_et_la_release_gnosis`

# AI Context
- Summary: Integrer Gnosis a l identite commune et a la resolution de cle
- Keywords: scaffolded-backlog, integrer gnosis a l identite commune et a la resolution de cle, implementation-ready
- Use when: Implementing the scaffolded slice for Integrer Gnosis a l identite commune et a la resolution de cle.
- Skip when: The change belongs to another backlog slice.

# Priority
- Priority: High
- Rationale: Set by scaffold input or defaulted for grooming.

# Tasks
- `task_005_orchestrer_l_identite_commune_et_la_release_gnosis`

# Notes
- Task `task_005_orchestrer_l_identite_commune_et_la_release_gnosis` was finished via `logics-manager flow finish task` on 2026-07-26.
