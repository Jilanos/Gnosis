## req_000_cadrer_et_construire_gnosis_generateur_de_decks_kapsule_par_pipeline_openai - Cadrer et construire Gnosis, generateur de decks Kapsule par pipeline OpenAI
> From version: 1.0.0
> Schema version: 1.0
> Status: Ready
> Understanding: 90
> Confidence: 85
> Complexity: High
> Theme: mvp
> Reminder: Update status/understanding/confidence and linked backlog/task references when you edit this doc.

# Needs
- Creer dans ce dossier un projet nomme Gnosis : outil web stylise qui genere
  des decks Kapsule a partir d'une liste de sujets techniques.
- Organiser automatiquement les sujets en grandes familles pedagogiques.
- Completer chaque famille avec les connaissances tres proches et fortement
  liees pour produire un contenu plus complet qu'une simple liste de mots-cles.
- Generer des fiches de cours courtes, precises et progressives, suivies d'un
  quiz pour chaque fiche.
- Sortir un JSON strictement compatible avec le format Kapsule existant.

# Context
- Le format de sortie attendu est celui de Kapsule : deck JSON
  `schemaVersion: 1`, fiches typees, sections fermees et quiz.
- L'analyse initiale a conclu qu'un prompt unique est fragile pour ce besoin :
  il faut un pipeline multi-etapes pour obtenir precision, couverture et
  validation.
- Le code applicatif doit rester simple, mais le prompt et les schemas doivent
  porter l'essentiel de la qualite.
- La page autour de l'outil doit etre relativement stylisee et directement
  utilisable.
- La cle OpenAI doit rester cote serveur.

# Acceptance criteria
- AC1: Le depot est initialise avec une documentation produit et architecture
  claire pour Gnosis.
- AC2: La chaine Logics request -> backlog -> task existe et decrit le pipeline
  OpenAI retenu.
- AC3: L'architecture explique pourquoi le pipeline multi-etapes est prefere a
  un prompt unique.
- AC4: Les contraintes Kapsule sont explicites : schema strict, sections
  fermees, quiz par fiche, validation avant export.
- AC5: Le scope MVP distingue clairement ce qui est inclus et exclu.
- AC6: Un remote Git public est configure pour le depot.

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
- `/home/paul/dev/Kapsule/SPEC.md`
- `/home/paul/dev/Kapsule/packages/schema/deck.schema.json`

# AI Context
- Summary: Cadrer et construire Gnosis, generateur de decks Kapsule par pipeline OpenAI.
- Keywords: gnosis, kapsule, openai, structured-output, deck-generator, pipeline, fiches, quiz
- Use when: You need to implement or review the Gnosis generator and its OpenAI pipeline.
- Skip when: The work is unrelated to Gnosis or Kapsule deck generation.

# Backlog
- `item_001_cadrer_et_construire_gnosis_generateur_de_decks_kapsule_par_pipeline_openai`
