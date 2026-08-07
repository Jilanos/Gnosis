## item_023_reduire_le_cout_d_une_generation_a_couverture_pedagogique_constante - Reduire le cout d'une generation a couverture pedagogique constante
> From version: 1.2.2
> Schema version: 1.0
> Status: Ready
> Understanding: 90%
> Confidence: 85%
> Progress: 0%
> Complexity: Medium
> Theme: Generation cost
> Reminder: Update status/understanding/confidence/progress and linked request/task references when you edit this doc.

# Problem
- L'etape Fiches renvoie l'objet `expansion` complet a chaque appel, soit environ 18 000 tokens d'entree redondants sur un deck de 20 fiches.
- Un appel par fiche repaie le contexte fixe et relance un raisonnement complet a chaque fois.
- Aucun niveau d'effort de raisonnement n'est demande alors que la redaction d'une fiche est bien plus mecanique que la planification.
- `max_output_tokens` de 12 000 par fiche et une cible de 1500 a 1800 mots poussent un volume de sortie superieur au besoin reel.

# Scope
- In:
  - N'envoyer a chaque appel de redaction que le contexte utile a la fiche concernee.
  - Evaluer et calibrer le regroupement de fiches par appel via `OPENAI_DECK_BATCH_SIZE`.
  - Demander un effort de raisonnement adapte a chaque etape.
  - Reconcilier les cibles de volume par fiche avec le principe de non-remplissage.
  - Ajouter un budget de tokens configurable qui arrete proprement la generation.
  - Mesurer le gain avant/apres sur un jeu de notions de reference.
- Out:
  - Supprimer des fiches, des sections ou des quiz pour reduire la sortie.
  - Introduire un cache de decks generes.
  - Reintroduire un quota de fiches.

# Acceptance criteria
- Le contexte envoye a l'etape Fiches ne contient plus la totalite de l'expansion pour chaque fiche.
- Le cout mesure d'une generation de reference baisse d'au moins 40 pour cent, couverture et nombre de fiches inchanges.
- Un depassement du budget configure arrete le job avec un message explicite et conserve la consommation mesuree.
- Les leviers retenus, leurs gains et leurs effets sur la qualite sont documentes.

# AC Traceability
- request-AC3 -> This backlog slice. Proof: Le contexte envoye a l'etape Fiches ne contient plus la totalite de l'expansion pour chaque fiche.
- request-AC4 -> This backlog slice. Proof: Le cout mesure d'une generation de reference baisse d'au moins 40 pour cent, couverture et nombre de fiches inchanges.
- request-AC5 -> This backlog slice. Proof: Un depassement du budget configure arrete le job avec un message explicite et conserve la consommation mesuree.
- request-AC6 -> This backlog slice. Proof: Les leviers retenus, leurs gains et leurs effets sur la qualite sont documentes.

# Decision framing
- Product framing: Not needed
- Architecture framing: Not needed

# Links
- Product brief(s): `prod_008_generation_gnosis_a_cout_maitrise`
- Architecture decision(s): (none yet)
- Request: `req_013_maitriser_le_cout_des_appels_openai_d_une_generation_gnosis`
- Primary task(s): `task_014_livrer_la_maitrise_du_cout_des_generations_gnosis`

# AI Context
- Summary: Reduire le cout d'une generation a couverture pedagogique constante
- Keywords: scaffolded-backlog, reduire le cout d'une generation a couverture pedagogique constante, implementation-ready
- Use when: Implementing the scaffolded slice for Reduire le cout d'une generation a couverture pedagogique constante.
- Skip when: The change belongs to another backlog slice.

# Priority
- Priority: High
- Rationale: Set by scaffold input or defaulted for grooming.
