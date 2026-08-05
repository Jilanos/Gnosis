## req_005_integrer_les_icones_icones_v3_et_les_liens_kapsule_paul_mondou_dans_gnosis - Integrer les icones Icones V3 et les liens Kapsule Paul Mondou dans Gnosis
> From version: 1.1.5
> Schema version: 1.0
> Status: Draft
> Understanding: 90%
> Confidence: 85%
> Complexity: Medium
> Theme: Branding
> Reminder: Update status/understanding/confidence and linked backlog/task references when you edit this doc.

# Needs
- Utiliser les assets Gnosis du corpus Icones V3 pour l'icone d'onglet et l'embleme.
- Remplacer les visuels des liens vers Kapsule et Paul Mondou avec les assets Icones V3 correspondants.

# Context
- Le dossier source est le corpus local Icones V3 fourni par l'operateur; les chemins references ici sont internes a ce corpus pour respecter les regles Logics.
- Assets attendus: gnosis/gnosis-icon-light, gnosis/gnosis-icon-dark, gnosis/gnosis-emblem-light, gnosis/gnosis-emblem-dark, plus kapsule et paulmondou pour les liens.
- Gnosis est connecte fonctionnellement a Kapsule; le lien Kapsule doit rester clair et non ambigu.

# Acceptance criteria
- AC1: L'icone d'onglet Gnosis utilise l'asset Gnosis Icones V3.
- AC2: L'embleme Gnosis visible dans l'interface utilise l'asset Gnosis Icones V3.
- AC3: Le lien vers Kapsule utilise l'identite Kapsule Icones V3 et conserve sa cible fonctionnelle.
- AC4: Le lien vers Paul Mondou utilise l'identite Paul Mondou Icones V3 et conserve sa cible parent.
- AC5: Les assets necessaires sont integres au repo Gnosis et ne dependent pas du dossier local au runtime.

# Definition of Ready (DoR)
- [x] Problem statement is explicit and user impact is clear.
- [x] Scope boundaries (in/out) are explicit.
- [x] Acceptance criteria are testable.
- [x] Dependencies and known risks are listed.

# Companion docs
- Product brief(s): `prod_004_identite_gnosis_alignee_sur_icones_v3`
- Architecture decision(s): (none yet)

# References
- Corpus externe Icones V3/gnosis/
- Corpus externe Icones V3/kapsule/
- Corpus externe Icones V3/paulmondou/
- logics/product/prod_003_gnosis_avec_identite_commune_et_cle_openai_reutilisable.md

# AI Context
- Summary: Integrer les icones Icones V3 et les liens Kapsule Paul Mondou dans Gnosis
- Keywords: request-chain-scaffold, integrer les icones icones v3 et les liens kapsule paul mondou dans gnosis, development-ready
- Use when: You need to implement or review the scaffolded workflow for Integrer les icones Icones V3 et les liens Kapsule Paul Mondou dans Gnosis.
- Skip when: The change is unrelated to this scaffolded request chain.

# Backlog
- `item_011_remplacer_favicon_et_embleme_gnosis_par_icones_v3`
- `item_012_remplacer_les_liens_kapsule_et_paul_mondou_par_les_identites_icones_v3`
