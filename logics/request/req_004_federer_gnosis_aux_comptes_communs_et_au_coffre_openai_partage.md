## req_004_federer_gnosis_aux_comptes_communs_et_au_coffre_openai_partage - Federer Gnosis aux comptes communs et au coffre OpenAI partage
> From version: 1.0.0
> Schema version: 1.0
> Status: Draft
> Understanding: 90%
> Confidence: 85%
> Complexity: High
> Theme: Identite partagee, gestion de secrets et livraison
> Reminder: Update status/understanding/confidence and linked backlog/task references when you edit this doc.

# Needs
- Gnosis doit reutiliser les comptes communs de Kapsule et ClaimLens, sans creer une identite ou un mot de passe distinct.
- Un utilisateur connecte doit pouvoir reutiliser sa cle OpenAI deja enregistree dans ClaimLens et mettre a jour sa cle depuis un coffre commun.
- Un invite peut fournir une cle OpenAI pour une generation, sans persistence ; ce champ n'est visible que pour un invite ou un utilisateur sans cle enregistree.
- Le jeton GNOSIS_ACCESS_TOKEN doit disparaitre de l'interface et ne plus intervenir pour les utilisateurs connectes.
- L'en-tete doit afficher strictement la version applicative, par exemple v1.0.0, ainsi qu'un lien vers https://paulmondou.fr/.
- La livraison doit inclure un commit de la chaine Logics, un commit d'implementation, une preparation de version, un commit de release, un push suivi jusqu'a CI verte, un tag de version, une release et la verification du deploiement sain.

# Context
- Kapsule est la source actuelle des comptes et des mots de passe scrypt ; ClaimLens authentifie deja ces comptes par lecture seule de la base Kapsule.
- ClaimLens chiffre ses cles OpenAI par utilisateur avec AES-GCM et un secret de deploiement hors SQLite, mais les enregistre actuellement dans sa base applicative.
- Gnosis est une application Node/Express avec jobs persistants et accepte aujourd'hui une cle ponctuelle ainsi qu'un GNOSIS_ACCESS_TOKEN partage.
- La base commune doit exposer un proprietaire unique pour les ecritures du coffre de cles. Gnosis et ClaimLens ne doivent pas ecrire concurremment dans le meme fichier SQLite sans contrat et migration coordonnes.
- La version courante du paquet Gnosis est 1.0.0 ; l'en-tete doit lire cette version depuis la source de version du build, sans commit ni date dans le texte visible.

# Acceptance criteria
- AC1: Gnosis authentifie un compte Kapsule commun et ne cree ni table de comptes ni mot de passe propres a Gnosis.
- AC2: Une cle OpenAI chiffree deja associee au compte commun par ClaimLens est resolue et utilisable par Gnosis sans resaisie ni affichage en clair.
- AC3: Le coffre partage chiffre les cles avec AES-GCM et un secret de deploiement externe ; les cles sont absentes des logs, reponses API, jobs, sauvegardes textuelles et interfaces, sauf valeur masquee.
- AC4: Le champ de cle ponctuelle est present pour les invites et les utilisateurs sans cle enregistree, absent pour les utilisateurs ayant une cle sauvegardee, et toute cle ponctuelle reste limitee a la requete ou au job sans persistence.
- AC5: GNOSIS_ACCESS_TOKEN n'est plus affiche ni requis pour une session authentifiee ; son comportement residuel est documente et couvert par des tests de compatibilite ou retire explicitement.
- AC6: Les jobs Gnosis sont attribues a une identite commune ou a une identite invitee et ne sont lisibles, annulables ou recuperables que par leur proprietaire.
- AC7: L'en-tete de Gnosis affiche v<version de package.json> et contient un lien accessible vers https://paulmondou.fr/.
- AC8: La livraison contient un commit Logics, un commit d'implementation, une preparation SemVer, un commit de release, un push, une CI verte, un tag et une release correspondant exactement a la version publiee.
- AC9: Apres release, le deploiement est verifie par healthcheck, parcours de connexion et generation controlee, et son resultat est consigne.

# Definition of Ready (DoR)
- [x] Problem statement is explicit and user impact is clear.
- [x] Scope boundaries (in/out) are explicit.
- [x] Acceptance criteria are testable.
- [x] Dependencies and known risks are listed.

# Companion docs
- Product brief(s): `prod_003_gnosis_avec_identite_commune_et_cle_openai_reutilisable`
- Architecture decision(s): (none yet)

# References
- package.json
- src/server/app.mjs
- src/client/main.jsx
- /home/paulm/dev/Kapsule/apps/backend/src/auth.mjs
- /home/paulm/dev/Kapsule/apps/backend/src/db.mjs
- /home/paulm/dev/ClaimLens/src/claimlens/kapsule_auth.py
- /home/paulm/dev/ClaimLens/src/claimlens/api_keys.py
- /home/paulm/dev/ClaimLens/src/claimlens/secrets.py

# AI Context
- Summary: Federer Gnosis aux comptes communs et au coffre OpenAI partage
- Keywords: request-chain-scaffold, federer gnosis aux comptes communs et au coffre openai partage, development-ready
- Use when: You need to implement or review the scaffolded workflow for Federer Gnosis aux comptes communs et au coffre OpenAI partage.
- Skip when: The change is unrelated to this scaffolded request chain.

# Backlog
- `item_007_definir_et_migrer_le_coffre_openai_commun_aux_comptes_kapsule`
- `item_008_integrer_gnosis_a_l_identite_commune_et_a_la_resolution_de_cle`
- `item_009_adapter_l_interface_gnosis_pour_la_cle_la_version_et_la_navigation`
- `item_010_preparer_publier_et_verifier_la_release_gnosis`
