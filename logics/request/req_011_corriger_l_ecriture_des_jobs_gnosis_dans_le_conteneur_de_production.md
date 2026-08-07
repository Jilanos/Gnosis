## req_011_corriger_l_ecriture_des_jobs_gnosis_dans_le_conteneur_de_production - Corriger l'ecriture des jobs Gnosis dans le conteneur de production
> From version: 1.2.0
> Schema version: 1.0
> Status: Done
> Understanding: 90%
> Confidence: 85%
> Complexity: Low
> Theme: Production reliability
> Reminder: Update status/understanding/confidence and linked backlog/task references when you edit this doc.

# Needs
- Toute generation echoue en production avec `EACCES: permission denied, mkdir '/app/data'`; le service doit pouvoir persister ses jobs.

# Context
- L'image runtime tourne en `USER node` alors que `/app` appartient a root et que `/app/data` n'existe pas.
- `createJobManager` ecrit `GNOSIS_JOBS_FILE` (par defaut `data/gnosis-jobs.json`) des la creation d'un job, donc l'echec est systematique.
- Quand un volume est monte sur `/app/data`, Docker reprend le proprietaire du repertoire de l'image: un repertoire absent ou root donne un volume root, non ecrivable par `node`.
- Regression d'exploitation presente depuis la conteneurisation (`526b537`), revelee a l'usage.

# Acceptance criteria
- AC1: Une generation aboutit dans le conteneur de production, avec ou sans volume monte sur `/app/data`.
- AC2: Le repertoire de persistance des jobs existe dans l'image et appartient a l'utilisateur non-root qui execute le serveur.
- AC3: Le correctif est verifie sur une image construite, pas seulement en execution locale hors conteneur.

# Definition of Ready (DoR)
- [x] Problem statement is explicit and user impact is clear.
- [x] Scope boundaries (in/out) are explicit.
- [x] Acceptance criteria are testable.
- [x] Dependencies and known risks are listed.

# Companion docs
- Product brief(s): (none yet)
- Architecture decision(s): (none yet)

# References
- Dockerfile
- .dockerignore
- src/server/jobs.mjs

# AI Context
- Summary: Corriger l'ecriture des jobs Gnosis dans le conteneur de production.
- Keywords: production, docker, permissions, jobs, EACCES
- Use when: Le service conteneurise ne peut pas ecrire son etat de jobs.
- Skip when: Le probleme concerne la generation elle-meme et non la persistance.

# Backlog
- none
- `item_020_corriger_l_ecriture_des_jobs_gnosis_dans_le_conteneur_de_production`
