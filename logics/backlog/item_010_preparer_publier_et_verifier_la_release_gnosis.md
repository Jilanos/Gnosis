## item_010_preparer_publier_et_verifier_la_release_gnosis - Preparer, publier et verifier la release Gnosis
> From version: 1.0.0
> Schema version: 1.0
> Status: Done
> Understanding: 90%
> Confidence: 85%
> Progress: 100%
> Complexity: Medium
> Theme: Release et deploiement
> Reminder: Update status/understanding/confidence/progress and linked request/task references when you edit this doc.

# Problem
- La livraison doit etre tracable depuis la specification jusqu'au deploiement, avec une version et un tag qui correspondent au code reel.

# Scope
- In:
  - Valider Logics, tests, build et audit avant chaque commit pertinent.
  - Creer et verifier le commit de la chaine Logics avant implementation.
  - Preparer le bump SemVer de fonctionnalite, mettre a jour la version visible et documenter les notes de release.
  - Creer le commit de release, pousser, suivre les checks CI jusqu'a leur succes, creer et pousser le tag, publier la release, puis verifier le healthcheck et un parcours deploye controle.
- Out:
  - Declarer une CI ou un deploiement reussi sans preuve observable.
  - Taguer une version differente de celle contenue dans package.json.

# Acceptance criteria
- AC1: Les commits Logics, implementation et release sont identifies et la version package, UI, tag et release sont identiques.
- AC2: Tous les checks CI requis sont verts apres le push de release avant publication du tag ou de la release.
- AC3: Le deploiement est confirme par healthcheck, connexion et generation controlee sans fuite de cle, avec resultat documente.

# AC Traceability
- request-AC8 -> This backlog slice. Proof: AC1: Les commits Logics, implementation et release sont identifies et la version package, UI, tag et release sont identiques.
- request-AC9 -> This backlog slice. Proof: AC2: Tous les checks CI requis sont verts apres le push de release avant publication du tag ou de la release.
- request-AC3 -> This backlog slice. Evidence needed: Le coffre partage chiffre les cles avec AES-GCM et un secret de deploiement externe ; les cles sont absentes des logs, reponses API, jobs, sauvegardes textuelles et interfaces, sauf valeur masquee.
- request-AC4 -> This backlog slice. Evidence needed: Le champ de cle ponctuelle est present pour les invites et les utilisateurs sans cle enregistree, absent pour les utilisateurs ayant une cle sauvegardee, et toute cle ponctuelle reste limitee a la requete ou au job sans persistence.
- request-AC5 -> This backlog slice. Evidence needed: GNOSIS_ACCESS_TOKEN n'est plus affiche ni requis pour une session authentifiee ; son comportement residuel est documente et couvert par des tests de compatibilite ou retire explicitement.
- request-AC6 -> This backlog slice. Evidence needed: Les jobs Gnosis sont attribues a une identite commune ou a une identite invitee et ne sont lisibles, annulables ou recuperables que par leur proprietaire.
- request-AC7 -> This backlog slice. Evidence needed: L'en-tete de Gnosis affiche v<version de package.json> et contient un lien accessible vers https://paulmondou.fr/.

# Decision framing
- Product framing: Not needed
- Architecture framing: Not needed

# Links
- Product brief(s): `prod_003_gnosis_avec_identite_commune_et_cle_openai_reutilisable`
- Architecture decision(s): (none yet)
- Request: `req_004_federer_gnosis_aux_comptes_communs_et_au_coffre_openai_partage`
- Primary task(s): `task_005_orchestrer_l_identite_commune_et_la_release_gnosis`

# AI Context
- Summary: Preparer, publier et verifier la release Gnosis
- Keywords: scaffolded-backlog, preparer, publier et verifier la release gnosis, implementation-ready
- Use when: Implementing the scaffolded slice for Preparer, publier et verifier la release Gnosis.
- Skip when: The change belongs to another backlog slice.

# Priority
- Priority: High
- Rationale: Set by scaffold input or defaulted for grooming.

# Tasks
- `task_005_orchestrer_l_identite_commune_et_la_release_gnosis`

# Notes
- Task `task_005_orchestrer_l_identite_commune_et_la_release_gnosis` was finished via `logics-manager flow finish task` on 2026-07-26.
