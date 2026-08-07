# Brief produit - Gnosis

## Vision

Gnosis transforme une liste brute de notions techniques en deck Kapsule
pedagogique, structure et importable. L'utilisateur n'a pas besoin de savoir
organiser un plan de cours : il apporte les sujets qu'il veut maitriser, puis
l'outil produit des fiches courtes, completes et testables.

## Probleme

Un apprenant technique collecte souvent des mots-cles sans savoir comment les
ordonner : concepts de base, notions voisines, prerequis implicites, pieges,
exemples, commandes, protocoles, outils. Un simple prompt peut produire un
resultat utile mais fragile : oublis, ordre pedagogique faible, contenu
inegal, quiz superficiels, ou JSON invalide.

Gnosis doit fiabiliser cette transformation.

## Utilisateurs cibles

- Developpeur ou administrateur systeme qui veut apprendre un domaine technique.
- Etudiant qui a une liste de notions a reviser.
- Operateur de Kapsule qui veut produire rapidement des decks de haute qualite.

## Proposition de valeur

- Partir d'une liste imparfaite de sujets.
- Regrouper automatiquement les notions en grandes familles.
- Completer chaque famille avec les connaissances proches et fortement liees.
- Generer des fiches Kapsule autonomes, progressives et precises.
- Ajouter un quiz court a chaque fiche.
- Exporter un JSON directement importable dans Kapsule.

## Parcours utilisateur MVP

1. L'utilisateur colle une liste de sujets techniques.
2. Il choisit la langue et son niveau d'apprentissage (low, medium,
   advanced). Aucun nombre de fiches, budget ou densite n'est demande :
   Gnosis deduit seul la granularite necessaire.
3. Gnosis affiche un plan intermediaire : familles, notions retenues, notions
   ajoutees, ordre pedagogique.
4. L'utilisateur lance la generation du deck.
5. Gnosis affiche un apercu lisible et le JSON final.
6. L'utilisateur telecharge ou copie le deck pour l'importer dans Kapsule.

## Pipeline produit

Le pipeline prioritaire est le plus precis, meme si le code reste simple :

1. Normalisation des entrees
   - Nettoyer les doublons.
   - Reconnaitre synonymes et variantes.
   - Separer notions, outils, protocoles, commandes et pratiques.

2. Classification en familles
   - Grouper les sujets par domaine coherent.
   - Identifier prerequis et dependances.
   - Ordonner les familles du plus fondamental au plus avance.

3. Expansion des connaissances proches
   - Ajouter concepts voisins indispensables.
   - Ajouter erreurs frequentes, modes de defaillance et cas pratiques.
   - Marquer chaque ajout comme "deduit" pour pouvoir l'expliquer.

4. Plan de deck
   - Convertir les familles en fiches.
   - Definir objectif, niveau, duree, notions couvertes.
   - Eviter les fiches trop larges ou redondantes.

5. Generation de fiches
   - Produire chaque fiche au format Kapsule.
   - Structure recommandee : `intro`, `concept`, `example`, `takeaways`,
     `quiz`.
   - Quiz a choix unique avec explication.

6. Validation et reparation
   - Valider le JSON contre le schema Kapsule.
   - Relancer une correction ciblee si la sortie est invalide.
   - Refuser explicitement les sorties non reparables.

## Scope MVP

In:

- Page web stylisee et responsive.
- Generation via OpenAI cote backend.
- Pipeline multi-etapes.
- Export JSON Kapsule.
- Validation structurelle locale.
- Historique minimal de la derniere generation dans le navigateur.

Out:

- Comptes utilisateurs.
- Paiement.
- Edition collaborative.
- Recherche web automatique obligatoire.
- Import direct dans Kapsule via API distante, tant que l'URL et le mode
  d'authentification ne sont pas stabilises.

## Qualite attendue

- Fiches lisibles en 5 a 10 minutes.
- Une fiche = un objectif d'apprentissage autonome et non redondant.
- Le nombre de fiches derive de la couverture utile, jamais d'un quota.
- Prerequis ajoutes uniquement s'ils sont indispensables, et toujours justifies.
- Deck progressif.
- Definitions concretes, exemples et pieges.
- Pas de proprietes hors schema Kapsule.
- Quiz utiles, non triviaux, avec explications.

## Signaux de succes

- Un deck genere s'importe dans Kapsule sans retouche.
- Le plan intermediaire revele des notions pertinentes que l'utilisateur avait
  oubliees.
- Les fiches ne se contentent pas de definitions : elles donnent des reperes
  operationnels.
- Le JSON final passe la validation locale a chaque generation.

## Risques produit

- Hallucination factuelle sur des domaines techniques pointus.
- Expansion trop large qui transforme un deck cible en cours generaliste.
- Cout ou latence eleves si chaque fiche est generee avec trop de contexte.
- Frustration si l'utilisateur ne peut pas ajuster le plan avant generation.

## Decisions produit

- Montrer un plan avant la generation finale.
- Prioriser la precision et la validation plutot que la generation en un clic.
- Garder le MVP centre sur l'export Kapsule.
- Ne jamais demander a l'utilisateur de reparer manuellement le JSON.

