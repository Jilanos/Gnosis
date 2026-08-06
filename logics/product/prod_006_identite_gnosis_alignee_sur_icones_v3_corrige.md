## prod_006_identite_gnosis_alignee_sur_icones_v3_corrige - Identite Gnosis alignee sur Icones V3 corrige
> Date: 2026-08-06
> Status: Proposed
> Related request: `req_008_remplacer_les_assets_gnosis_par_les_masters_icones_v3_corriges`
> Related backlog: `item_015_remplacer_les_douze_assets_client_gnosis`, `item_016_publier_la_version_1_1_8_apres_remplacement_des_assets`
> Related task: `task_009_remplacer_les_assets_gnosis_par_les_masters_icones_v3_corriges`
> Related architecture: (none yet)
> Reminder: Update status, linked refs, scope, decisions, success signals, and open questions when you edit this doc.

# Overview
Les assets Gnosis, Kapsule et Paul Mondou servis par le client doivent venir des masters approuves.

# Goals
- Supprimer toute trace du lot d'images errone.
- Conserver les noms de fichiers pour eviter une refonte des imports.

# Non-goals
- Fusionner les variantes dark/light en un asset unique.

# Scope and guardrails
- In: scaffolded request, product, backlog, orchestration task, validation, and handoff context.
- Out: unrelated workflow docs and implementation of generated tasks.

# Key product decisions
- Use structured input as the source of truth for generated docs.
- Keep generated write paths local and repo-bounded.

# Success signals
- Generated docs pass lint and audit without broad manual rewrites.
- Context-pack output can be handed to an implementation agent directly.

# References
- Product back-reference: `req_008_remplacer_les_assets_gnosis_par_les_masters_icones_v3_corriges`
- Task back-reference: `task_009_remplacer_les_assets_gnosis_par_les_masters_icones_v3_corriges`
