## item_007_definir_et_migrer_le_coffre_openai_commun_aux_comptes_kapsule - Definir et migrer le coffre OpenAI commun aux comptes Kapsule
> From version: 1.0.0
> Schema version: 1.0
> Status: Ready
> Understanding: 90%
> Confidence: 85%
> Progress: 0%
> Complexity: High
> Theme: Contrat de donnees et secrets partages
> Reminder: Update status/understanding/confidence/progress and linked request/task references when you edit this doc.

# Problem
- Les comptes sont communs via Kapsule mais la cle chiffree est encore isolee dans la base ClaimLens.
- Une ecriture directe par plusieurs applications dans un SQLite partage serait fragile et ambigue sur la responsabilite des migrations.

# Scope
- In:
  - Choisir le service proprietaire et le contrat d'acces au coffre commun.
  - Migrer sans perte les cles OpenAI ClaimLens vers le coffre commun ou fournir une compatibilite de lecture documentee pendant migration.
  - Conserver AES-256-GCM, les valeurs masquees et un secret de chiffrement externe commun ou une rotation explicitement planifiee.
  - Ajouter la lecture de compte Kapsule et le contrat de resolution de cle necessaires a Gnosis.
- Out:
  - Copier des mots de passe hors de la base Kapsule.
  - Introduire un echange de secrets en clair entre frontends.
  - Modifier une cle existante sans migration testee et plan de retour arriere.

# Acceptance criteria
- AC1: Le proprietaire unique des ecritures, le schema, les migrations, les droits d'acces et la strategie de sauvegarde/rotation sont documentes et testes.
- AC2: Une cle OpenAI ClaimLens existante peut etre resolue pour le meme identifiant Kapsule sans reauthentification ni copie en clair.
- AC3: Les tests prouvent chiffrement, masquage, redaction, echec propre sans secret de chiffrement et isolation par utilisateur.

# AC Traceability
- request-AC1 -> This backlog slice. Proof: AC1: Le proprietaire unique des ecritures, le schema, les migrations, les droits d'acces et la strategie de sauvegarde/rotation sont documentes et testes.
- request-AC2 -> This backlog slice. Proof: AC2: Une cle OpenAI ClaimLens existante peut etre resolue pour le meme identifiant Kapsule sans reauthentification ni copie en clair.
- request-AC3 -> This backlog slice. Proof: AC3: Les tests prouvent chiffrement, masquage, redaction, echec propre sans secret de chiffrement et isolation par utilisateur.

# Decision framing
- Product framing: Not needed
- Architecture framing: Not needed

# Links
- Product brief(s): `prod_003_gnosis_avec_identite_commune_et_cle_openai_reutilisable`
- Architecture decision(s): (none yet)
- Request: `req_004_federer_gnosis_aux_comptes_communs_et_au_coffre_openai_partage`
- Primary task(s): `task_005_orchestrer_l_identite_commune_et_la_release_gnosis`

# AI Context
- Summary: Definir et migrer le coffre OpenAI commun aux comptes Kapsule
- Keywords: scaffolded-backlog, definir et migrer le coffre openai commun aux comptes kapsule, implementation-ready
- Use when: Implementing the scaffolded slice for Definir et migrer le coffre OpenAI commun aux comptes Kapsule.
- Skip when: The change belongs to another backlog slice.

# Priority
- Priority: High
- Rationale: Set by scaffold input or defaulted for grooming.
