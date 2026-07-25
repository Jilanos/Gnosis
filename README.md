# Gnosis

Gnosis est un generateur de decks Kapsule a partir d'une liste de sujets
techniques. L'utilisateur saisit des mots-cles ou notions a maitriser ; l'outil
les organise en familles, complete les notions proches, puis produit un deck de
fiches de cours avec quiz au format JSON importable dans Kapsule.

Le projet est volontairement simple cote code : une page web soignee, un backend
leger, une cle OpenAI cote serveur, et un pipeline de prompts strictement
cadre par schemas.

## Documents

- [Brief produit](docs/product.md)
- [Architecture](docs/architecture.md)
- [Logics](LOGICS.md)

## Direction technique

- Frontend : application web responsive, orientee outil, sans landing page.
- Backend : API Node/Express, cle OpenAI jamais exposee au navigateur.
- Generation : pipeline OpenAI en plusieurs etapes, pas un prompt unique.
- Sortie : JSON strict conforme au contrat Kapsule `schemaVersion: 1`.
- Validation : schema JSON local + boucle de reparation ciblee si besoin.

## Installation

```bash
npm install
cp .env.example .env
```

Renseigner ensuite `OPENAI_API_KEY` dans `.env`.

Pour tester sans appel OpenAI :

```bash
GNOSIS_MOCK_OPENAI=1 npm run dev
```

## Commandes

```bash
npm run dev             # API Express + frontend Vite
npm run build           # build frontend
npm test                # tests unitaires et API mock
npm run validate:sample # validation fixture Kapsule
```

En developpement :

- Frontend : `http://localhost:5173`
- API : `http://localhost:8787`

## Pipeline implemente

1. Normalisation des sujets.
2. Regroupement en familles pedagogiques.
3. Expansion par notions proches.
4. Plan de deck.
5. Generation du deck Kapsule.
6. Validation locale.
7. Reparation ciblee si OpenAI produit un JSON invalide.

## Workflow Logics

La chaine initiale est dans `logics/` :

- `req_000_cadrer_et_construire_gnosis_generateur_de_decks_kapsule_par_pipeline_openai`
- `item_001_cadrer_et_construire_gnosis_generateur_de_decks_kapsule_par_pipeline_openai`
- `task_001_cadrer_et_construire_gnosis_generateur_de_decks_kapsule_par_pipeline_openai`

La slice MVP applicative est dans :

- `req_001_construire_le_mvp_applicatif_gnosis`
- `item_002_construire_le_mvp_applicatif_gnosis`
- `task_002_construire_le_mvp_applicatif_gnosis`
## Generation asynchrone et acces

La generation est un job persistant : `POST /api/generate-deck` renvoie `202` avec un identifiant,
`GET /api/generate-deck/:id` expose l'etat et `DELETE /api/generate-deck/:id` annule un job en cours.
Les jobs sont stockes dans `GNOSIS_JOBS_FILE` (par defaut `data/gnosis-jobs.json`) et la capacite est
bornee par `GNOSIS_MAX_RUNNING_JOBS` et `GNOSIS_MAX_QUEUED_JOBS`. Le serveur propage l'annulation aux
appels OpenAI. En production, configure `GNOSIS_ACCESS_TOKEN`; l'interface transmet ce jeton dans
`x-gnosis-access-token` sans jamais exposer `OPENAI_API_KEY`.

`GNOSIS_TRUST_PROXY` doit correspondre au nombre de proxies Caddy effectivement controles. La CI PR
execute tests, build, validation de fixture et audit npm avant merge.
