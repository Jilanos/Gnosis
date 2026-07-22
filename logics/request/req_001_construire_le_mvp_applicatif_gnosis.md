## req_001_construire_le_mvp_applicatif_gnosis - Construire le MVP applicatif Gnosis
> From version: 1.0.0
> Schema version: 1.0
> Status: Done
> Understanding: 90
> Confidence: 85
> Complexity: High
> Theme: mvp
> Reminder: Update status/understanding/confidence and linked backlog/task references when you edit this doc.

# Needs
- Construire un MVP applicatif utilisable de Gnosis.
- Fournir une interface web stylisee pour saisir des sujets techniques et
  exporter un deck Kapsule.
- Implementer un backend qui orchestre le pipeline OpenAI cote serveur.
- Valider localement le deck final contre le contrat Kapsule.
- Permettre les tests sans cle OpenAI via un mode mock.

# Context
- La slice de cadrage produit/architecture est terminee.
- L'application doit rester simple mais robuste : Vite/React pour le frontend,
  Express pour l'API, OpenAI Responses API pour les sorties structurees.
- Le MVP doit tourner localement et etre hebergeable ensuite.
- La cle OpenAI ne doit jamais etre exposee au navigateur.

# Acceptance criteria
- AC1: Le frontend permet de saisir des sujets, regler niveau/densite/nombre de
  fiches et lancer la generation.
- AC2: Le backend expose `POST /api/generate-deck` et `GET /api/health`.
- AC3: Le pipeline implemente normalisation, familles, expansion, plan, deck,
  validation et reparation.
- AC4: Le deck final respecte le schema Kapsule et peut etre copie ou telecharge.
- AC5: Les tests couvrent validation, pipeline mock et API.
- AC6: `npm test`, `npm run build` et `npm run validate:sample` passent.

# Definition of Ready (DoR)
- [x] Problem statement is explicit and user impact is clear.
- [x] Scope boundaries (in/out) are explicit.
- [x] Acceptance criteria are testable.
- [x] Dependencies and known risks are listed.

# Companion docs
- Product brief(s): `prod_001_gnosis_product_brief`
- Architecture decision(s): `adr_001_gnosis_pipeline_openai_kapsule`

# References
- `docs/product.md`
- `docs/architecture.md`
- `src/server/openai-pipeline.mjs`
- `src/client/main.jsx`

# AI Context
- Summary: Construire le MVP applicatif Gnosis.
- Keywords: gnosis, react, express, openai, kapsule, deck-generator, mvp
- Use when: Implementing or reviewing the executable Gnosis MVP.
- Skip when: The work is unrelated to the Gnosis app.

# Backlog
- `item_002_construire_le_mvp_applicatif_gnosis`
