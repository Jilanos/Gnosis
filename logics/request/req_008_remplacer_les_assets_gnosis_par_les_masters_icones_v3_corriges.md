## req_008_remplacer_les_assets_gnosis_par_les_masters_icones_v3_corriges - Remplacer les assets Gnosis par les masters Icones V3 corriges
> From version: 1.1.7
> Schema version: 1.0
> Status: Draft
> Understanding: 90%
> Confidence: 85%
> Complexity: High
> Theme: Brand asset integration
> Reminder: Update status/understanding/confidence and linked backlog/task references when you edit this doc.

# Needs
- Remplacer les douze PNG de `src/client/assets/` par les masters corriges, en dupliquant le master unique sur les variantes dark et light.

# Context
- Les masters approuves sont dans `WORK/perso/Icones V3`, tous en PNG RGBA 1024x1024.
- Le suffixe de variante designe le contour: `-dark` porte un lisere pale et se pose sur fond sombre, `-light` porte un contour navy et se pose sur fond clair.
- Le lot Icones V3 precedemment integre reposait sur de mauvaises images: ce corpus corrige la source, pas la demarche.
- Certaines marques n'ont qu'un ou deux masters (Gnosis, Paul Mondou, Kapsule, F1 Datas). Consigne operateur: reutiliser ce master unique pour l'embleme comme pour l'icone.
- Les quatorze masters sont a fond transparent: coins a alpha=0 et 28% a 87% de pixels transparents selon l'asset. Consigne operateur: ne rien ajouter derriere, ni en favicon ni en embleme.
- Gnosis ne dispose que d'un seul master `gnosis/gnosis.png`, a utiliser pour l'embleme comme pour l'icone.
- Les emplacements dark et light recevront donc des contenus identiques: c'est la consigne operateur, pas un oubli.
- Fusionner ces paires en un fichier unique reste possible mais reste hors perimetre pour limiter le churn de references.

# Acceptance criteria
- AC1: Chaque fichier d'icone livre est octet pour octet le master correspondant de Icones V3.
- AC2: Aucune reference d'asset n'est cassee apres remplacement, extensions et types MIME inclus.
- AC3: Le rendu est verifie visuellement sur le theme reellement servi par l'application.
- AC4: La transparence des masters est preservee: aucun fond, plaque ou cartouche n'est ajoute derriere l'asset, favicon et embleme compris.
- AC5: La livraison se termine par un commit de version X.Y.Z+1, un push, puis un tag annote vX.Y.Z+1 dont le workflow release est vert.

# Definition of Ready (DoR)
- [x] Problem statement is explicit and user impact is clear.
- [x] Scope boundaries (in/out) are explicit.
- [x] Acceptance criteria are testable.
- [x] Dependencies and known risks are listed.

# Companion docs
- Product brief(s): `prod_006_identite_gnosis_alignee_sur_icones_v3_corrige`
- Architecture decision(s): (none yet)

# References
- WORK/perso/Icones V3/

# AI Context
- Summary: Remplacer les assets Gnosis par les masters Icones V3 corriges
- Keywords: request-chain-scaffold, remplacer les assets gnosis par les masters icones v3 corriges, development-ready
- Use when: You need to implement or review the scaffolded workflow for Remplacer les assets Gnosis par les masters Icones V3 corriges.
- Skip when: The change is unrelated to this scaffolded request chain.

# Backlog
- `item_015_remplacer_les_douze_assets_client_gnosis`
- `item_016_publier_la_version_1_1_8_apres_remplacement_des_assets`
