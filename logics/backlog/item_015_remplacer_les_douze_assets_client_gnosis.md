## item_015_remplacer_les_douze_assets_client_gnosis - Remplacer les douze assets client Gnosis
> From version: 1.1.7
> Schema version: 1.0
> Status: In progress
> Understanding: 90%
> Confidence: 85%
> Progress: 60%
> Complexity: Medium
> Theme: Brand asset integration
> Reminder: Update status/understanding/confidence/progress and linked request/task references when you edit this doc.

# Problem
- Les assets embarques par le client Vite proviennent d'un lot errone.

# Scope
- In:
  - `gnosis-emblem-dark.png` et `gnosis-emblem-light.png` depuis `gnosis/gnosis.png`
  - `gnosis-icon-dark.png` et `gnosis-icon-light.png` depuis `gnosis/gnosis.png`
  - `kapsule-icon-dark.png`, `kapsule-icon-light.png`, `kapsule-favicon-dark-mirrored.png` et `kapsule-favicon-light-mirrored.png` depuis `kapsule/kapsule-icon.png`
  - `paulmondou-icon-dark.png`, `paulmondou-icon-light.png`, `paulmondou-icon-dark-transparent.png` et `paulmondou-icon-light-transparent.png` depuis `paulmondou/paulmondou-emblem.png`
- Out:
  - Editer `dist/`: sortie de build aux noms hashes, regeneree par la CI.
  - Renommer ou fusionner les variantes dark/light.
  - Ajouter un fond, une plaque de couleur ou un cartouche derriere un asset transparent.

# Acceptance criteria
- AC1: Les douze fichiers correspondent aux masters attendus.
- AC2: Aucun import de `src/client` n'est casse et le favicon reste resolu.
- AC3: Embleme et icone s'affichent correctement dans les deux themes du client.

# AC Traceability
- request-AC1 -> This backlog slice. Proof: AC1: Les douze fichiers correspondent aux masters attendus.
- request-AC2 -> This backlog slice. Proof: AC2: Aucun import de `src/client` n'est casse et le favicon reste resolu.
- request-AC3 -> This backlog slice. Proof: AC3: Embleme et icone s'affichent correctement dans les deux themes du client.
- request-AC4 -> This backlog slice. Proof: AC3: Embleme et icone s'affichent correctement dans les deux themes du client.

# Decision framing
- Product framing: Not needed
- Architecture framing: Not needed

# Links
- Product brief(s): `prod_006_identite_gnosis_alignee_sur_icones_v3_corrige`
- Architecture decision(s): (none yet)
- Request: `req_008_remplacer_les_assets_gnosis_par_les_masters_icones_v3_corriges`
- Primary task(s): `task_009_remplacer_les_assets_gnosis_par_les_masters_icones_v3_corriges`

# AI Context
- Summary: Remplacer les douze assets client Gnosis
- Keywords: scaffolded-backlog, remplacer les douze assets client gnosis, implementation-ready
- Use when: Implementing the scaffolded slice for Remplacer les douze assets client Gnosis.
- Skip when: The change belongs to another backlog slice.

# Priority
- Priority: High
- Rationale: Set by scaffold input or defaulted for grooming.
