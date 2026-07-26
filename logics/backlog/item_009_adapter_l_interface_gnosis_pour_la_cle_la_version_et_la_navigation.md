## item_009_adapter_l_interface_gnosis_pour_la_cle_la_version_et_la_navigation - Adapter l interface Gnosis pour la cle, la version et la navigation
> From version: 1.0.0
> Schema version: 1.0
> Status: In progress
> Understanding: 90%
> Confidence: 85%
> Progress: 75%
> Complexity: Medium
> Theme: Experience utilisateur
> Reminder: Update status/understanding/confidence/progress and linked request/task references when you edit this doc.

# Problem
- L'interface expose deux champs de secrets sans distinguer l'identite et ne rend pas la version ni le retour au site disponibles.

# Scope
- In:
  - Afficher l'etat connecte, la cle enregistree masquee et une action de gestion vers le coffre commun si necessaire.
  - Afficher la cle ponctuelle seulement a l'invite ou a l'utilisateur connecte sans cle sauvegardee.
  - Afficher v<version package.json> dans l'en-tete et un lien vers https://paulmondou.fr/.
  - Conserver des libelles accessibles et les comportements mobiles.
- Out:
  - Afficher une cle OpenAI complete apres son enregistrement.
  - Ajouter un ecran marketing ou changer la direction visuelle du produit.

# Acceptance criteria
- AC1: Les etats invite, connecte sans cle et connecte avec cle rendent les bons controles sans fuite de secret.
- AC2: L'en-tete affiche exactement la version du package et un lien fonctionnel, securise et accessible vers paulmondou.fr.
- AC3: Les tests frontend couvrent les trois etats de cle ainsi que la version et le lien.

# AC Traceability
- request-AC3 -> This backlog slice. Proof: AC1: Les etats invite, connecte sans cle et connecte avec cle rendent les bons controles sans fuite de secret.
- request-AC4 -> This backlog slice. Proof: AC2: L'en-tete affiche exactement la version du package et un lien fonctionnel, securise et accessible vers paulmondou.fr.
- request-AC5 -> This backlog slice. Proof: AC3: Les tests frontend couvrent les trois etats de cle ainsi que la version et le lien.
- request-AC7 -> This backlog slice. Proof: AC3: Les tests frontend couvrent les trois etats de cle ainsi que la version et le lien.

# Decision framing
- Product framing: Not needed
- Architecture framing: Not needed

# Links
- Product brief(s): `prod_003_gnosis_avec_identite_commune_et_cle_openai_reutilisable`
- Architecture decision(s): (none yet)
- Request: `req_004_federer_gnosis_aux_comptes_communs_et_au_coffre_openai_partage`
- Primary task(s): `task_005_orchestrer_l_identite_commune_et_la_release_gnosis`

# AI Context
- Summary: Adapter l interface Gnosis pour la cle, la version et la navigation
- Keywords: scaffolded-backlog, adapter l interface gnosis pour la cle, la version et la navigation, implementation-ready
- Use when: Implementing the scaffolded slice for Adapter l interface Gnosis pour la cle, la version et la navigation.
- Skip when: The change belongs to another backlog slice.

# Priority
- Priority: Medium
- Rationale: Set by scaffold input or defaulted for grooming.
