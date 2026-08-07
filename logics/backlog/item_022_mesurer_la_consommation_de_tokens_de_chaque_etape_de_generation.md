## item_022_mesurer_la_consommation_de_tokens_de_chaque_etape_de_generation - Mesurer la consommation de tokens de chaque etape de generation
> From version: 1.2.2
> Schema version: 1.0
> Status: In progress
> Understanding: 90%
> Confidence: 85%
> Progress: 85%
> Complexity: Medium
> Theme: Generation cost
> Reminder: Update status/understanding/confidence/progress and linked request/task references when you edit this doc.

# Problem
- Le champ `usage` de chaque reponse OpenAI est ignore, donc aucune decision d'optimisation ne peut etre validee.
- Un echec ou un abandon en cours de generation ne laisse aucune trace de ce qui a deja ete paye.

# Scope
- In:
  - Collecter `usage` a chaque appel structure et l'agreger par etape du pipeline.
  - Exposer le total et le detail par etape dans le resultat de job et dans l'interface.
  - Conserver la mesure meme lorsque la generation echoue ou est annulee.
  - Couvrir la collecte par des tests.
- Out:
  - Convertir les tokens en euros a partir d'une grille de prix codee en dur.
  - Stocker un historique de consommation par utilisateur.

# Acceptance criteria
- Chaque etape du pipeline rapporte ses tokens d'entree, de sortie, de raisonnement et son total.
- Le resultat de job porte un cumul par etape et un cumul global.
- Une generation interrompue conserve la consommation deja engagee.
- L'interface affiche la consommation de la generation terminee.

# AC Traceability
- request-AC1 -> This backlog slice. Proof: Chaque etape du pipeline rapporte ses tokens d'entree, de sortie, de raisonnement et son total.
- request-AC2 -> This backlog slice. Proof: Le resultat de job porte un cumul par etape et un cumul global.

# Decision framing
- Product framing: Not needed
- Architecture framing: Not needed

# Links
- Product brief(s): `prod_008_generation_gnosis_a_cout_maitrise`
- Architecture decision(s): (none yet)
- Request: `req_013_maitriser_le_cout_des_appels_openai_d_une_generation_gnosis`
- Primary task(s): `task_014_livrer_la_maitrise_du_cout_des_generations_gnosis`

# AI Context
- Summary: Mesurer la consommation de tokens de chaque etape de generation
- Keywords: scaffolded-backlog, mesurer la consommation de tokens de chaque etape de generation, implementation-ready
- Use when: Implementing the scaffolded slice for Mesurer la consommation de tokens de chaque etape de generation.
- Skip when: The change belongs to another backlog slice.

# Priority
- Priority: High
- Rationale: Set by scaffold input or defaulted for grooming.
