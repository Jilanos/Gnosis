## item_016_publier_la_version_1_1_8_apres_remplacement_des_assets - Publier la version 1.1.8 apres remplacement des assets
> From version: 1.1.7
> Schema version: 1.0
> Status: Ready
> Understanding: 90%
> Confidence: 85%
> Progress: 0%
> Complexity: Low
> Theme: Release delivery
> Reminder: Update status/understanding/confidence/progress and linked request/task references when you edit this doc.

# Problem
- Sans commit de version ni tag, les nouveaux assets restent non deployes: le tag `v1.1.8` est le seul declencheur du deploiement.

# Scope
- In:
  - Incrementer `package.json`, la racine de `package-lock.json` et `CHANGELOG.md` de `1.1.7` vers `1.1.8`
  - Commit `Prepare ... v1.1.8` puis push sur `main`
  - Attente du CI vert sur ce commit exact avant tout tag
  - Tag annote `v1.1.8` pousse, puis verification des jobs validate, publish, deploy et release
- Out:
  - Taguer avant que le CI requis ne soit vert.
  - Retaguer une release existante ou forcer un push sur la branche de release.

# Acceptance criteria
- AC1: Toutes les surfaces canoniques declarent `1.1.8`.
- AC2: Le tag annote `v1.1.8` pointe sur le commit de version pousse sur `main`.
- AC3: Le workflow release est vert sur validate, publish, deploy et release.
- AC4: Le SHA, le tag et l'URL du run sont consignes dans le closeout de la tache.

# AC Traceability
- request-AC5 -> This backlog slice. Proof: AC1: Toutes les surfaces canoniques declarent `1.1.8`.

# Decision framing
- Product framing: Not needed
- Architecture framing: Not needed

# Links
- Product brief(s): `prod_006_identite_gnosis_alignee_sur_icones_v3_corrige`
- Architecture decision(s): (none yet)
- Request: `req_008_remplacer_les_assets_gnosis_par_les_masters_icones_v3_corriges`
- Primary task(s): `task_009_remplacer_les_assets_gnosis_par_les_masters_icones_v3_corriges`

# AI Context
- Summary: Publier la version 1.1.8 apres remplacement des assets
- Keywords: scaffolded-backlog, publier la version 1.1.8 apres remplacement des assets, implementation-ready
- Use when: Implementing the scaffolded slice for Publier la version 1.1.8 apres remplacement des assets.
- Skip when: The change belongs to another backlog slice.

# Priority
- Priority: High
- Rationale: Set by scaffold input or defaulted for grooming.
