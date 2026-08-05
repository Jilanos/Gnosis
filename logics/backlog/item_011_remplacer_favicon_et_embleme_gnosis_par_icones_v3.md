## item_011_remplacer_favicon_et_embleme_gnosis_par_icones_v3 - Remplacer favicon et embleme Gnosis par Icones V3
> From version: 1.1.5
> Schema version: 1.0
> Status: In progress
> Understanding: 90%
> Confidence: 85%
> Progress: 10%
> Complexity: Medium
> Theme: Branding
> Reminder: Update status/understanding/confidence/progress and linked request/task references when you edit this doc.

# Problem
- Les surfaces de marque Gnosis doivent consommer les nouveaux assets sans couplage au dossier local.

# Scope
- In:
  - Identifier favicon, manifest, metadata et composant d'embleme.
  - Copier les assets Gnosis Icones V3 dans les chemins publics ou source du repo.
  - Mettre a jour les references light/dark et verifier les formats png/svg existants.
- Out:
  - Changer le layout principal hors remplacement d'assets.
  - Refondre la direction artistique au-dela du corpus Icones V3.

# Acceptance criteria
- AC1: Le favicon et les metadata d'onglet resolvent l'icone Gnosis Icones V3.
- AC2: L'embleme Gnosis affiche l'asset Icones V3 adapte au theme courant.
- AC3: Les assets references existent dans le repo et passent la validation locale pertinente.

# AC Traceability
- request-AC1 -> This backlog slice. Proof: AC1: Le favicon et les metadata d'onglet resolvent l'icone Gnosis Icones V3.
- request-AC2 -> This backlog slice. Proof: AC2: L'embleme Gnosis affiche l'asset Icones V3 adapte au theme courant.
- request-AC5 -> This backlog slice. Proof: AC3: Les assets references existent dans le repo et passent la validation locale pertinente.

# Decision framing
- Product framing: Not needed
- Architecture framing: Not needed

# Links
- Product brief(s): `prod_004_identite_gnosis_alignee_sur_icones_v3`
- Architecture decision(s): (none yet)
- Request: `req_005_integrer_les_icones_icones_v3_et_les_liens_kapsule_paul_mondou_dans_gnosis`
- Primary task(s): `task_006_orchestrer_l_integration_icones_v3_dans_gnosis`

# AI Context
- Summary: Remplacer favicon et embleme Gnosis par Icones V3
- Keywords: scaffolded-backlog, remplacer favicon et embleme gnosis par icones v3, implementation-ready
- Use when: Implementing the scaffolded slice for Remplacer favicon et embleme Gnosis par Icones V3.
- Skip when: The change belongs to another backlog slice.

# Priority
- Priority: High - l'identite Gnosis doit etre visible des l'arrivee
- Rationale: Set by scaffold input or defaulted for grooming.
