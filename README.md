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
- Backend : API Node/Express ou equivalent leger, cle OpenAI jamais exposee au
  navigateur.
- Generation : pipeline OpenAI en plusieurs etapes, pas un prompt unique.
- Sortie : JSON strict conforme au contrat Kapsule `schemaVersion: 1`.
- Validation : schema JSON local + boucle de reparation ciblee si besoin.

## Workflow Logics

La chaine initiale est dans `logics/` :

- `req_000_cadrer_et_construire_gnosis_generateur_de_decks_kapsule_par_pipeline_openai`
- `item_001_cadrer_et_construire_gnosis_generateur_de_decks_kapsule_par_pipeline_openai`
- `task_001_cadrer_et_construire_gnosis_generateur_de_decks_kapsule_par_pipeline_openai`

