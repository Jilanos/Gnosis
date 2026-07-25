# Audit technique - Gnosis

Date : 2026-07-25  
Revision auditee : `526b537` (`main`)  
Perimetre : frontend React, API Express, pipeline OpenAI, validation Kapsule, tests, Docker,
CI/CD et gouvernance Logics.

## Verdict

Gnosis dispose d'un MVP propre et lisible. Les corrections du precedent audit ont traite les
reponses tronquees, les timeouts OpenAI, le decoupage par lots, la protection de la cle serveur et
le conteneur non privilegie. Les tests, le build et l'audit npm sont verts.

Le principal risque est desormais architectural : une generation longue reste une requete HTTP
synchrone. Les budgets de temps du navigateur, du serveur et du pipeline sont incompatibles, et
l'annulation du navigateur ne stoppe pas les appels OpenAI. En production, cela peut produire une
depense sans resultat recuperable.

## Verifications executees

| Controle | Resultat |
| --- | --- |
| `npm test` | 13 tests passes |
| `npm run build` | OK, bundle JS 208,78 kB (66,14 kB gzip) |
| `npm audit --omit=dev` | 0 vulnerabilite connue |
| `logics-manager audit` | OK |
| `logics-manager lint` | OK |
| Etat Git initial | Propre sur `main` |

## Constats prioritaires

### P0 - Le client abandonne avant la fin normale du pipeline

Le frontend annule apres 120 secondes. Le serveur autorise 180 secondes. Chaque appel OpenAI peut
durer 60 secondes avec un retry, et le pipeline execute quatre etapes preparatoires puis un appel
par lot de fiches. Avec 8 fiches et la taille de lot par defaut a 1, au moins 12 appels sont
sequentiels, hors reparation.

Une generation saine mais un peu lente peut donc etre declaree echouee par l'UI. Le serveur continue
ensuite le pipeline car le signal d'abandon HTTP n'est pas propage au SDK OpenAI.

Solution recommandee :

- transformer la generation en job persistant (`POST` -> identifiant, puis polling ou SSE) ;
- enregistrer statut, etape, resultat et erreur afin de reprendre l'affichage apres reconnexion ;
- propager un `AbortSignal` jusqu'aux appels OpenAI si le job est annule ;
- definir un budget global serveur coherent, distinct du timeout unitaire ;
- a court terme, aligner les timeouts et reduire fortement le nombre maximal de fiches.

### P0 - Aucune limite de concurrence des pipelines

Le rate limiter compte des requetes dans une fenetre, mais n'empeche pas 20 generations couteuses
de demarrer simultanement. Chaque generation peut ouvrir une longue serie d'appels OpenAI. Cela peut
saturer CPU, sockets, quotas OpenAI et memoire, puis multiplier les retries et les echecs.

Solution : ajouter une file bornee et une limite de concurrence faible, par exemple 1 a 3 jobs selon
la machine. Retourner `429` ou `503` avec `Retry-After` lorsque la file est pleine.

### P0 - La CI ne s'execute que sur les tags de release

Il n'existe pas de workflow qualite sur push ou pull request. Tests et build ne sont lances qu'apres
creation d'un tag `v*`, trop tard pour proteger `main`.

Solution : ajouter `ci.yml` sur `push` et `pull_request` avec `npm ci`, tests, build et validation de
la fixture. La release doit reutiliser exactement les memes controles.

### P1 - Le rate limiting par IP ne fonctionne pas correctement derriere un proxy

Le code utilise `req.ip`, mais Express n'active pas `trust proxy`. Derriere Caddy, toutes les
requêtes risquent d'etre attribuees a l'adresse du proxy et de partager le meme quota. A l'inverse,
activer aveuglement tous les proxies permettrait de falsifier `X-Forwarded-For`.

La `Map` des buckets ne supprime par ailleurs jamais les anciennes cles, ce qui permet une croissance
memoire continue avec de nombreuses adresses.

Solution :

- configurer precisement le nombre ou la plage de proxies approuves ;
- utiliser un rate limiter maintenu avec nettoyage automatique ;
- combiner limite IP, limite par jeton/compte et limite globale de concurrence ;
- tester le comportement avec les en-tetes reellement fournis par Caddy.

### P1 - La cle d'acces serveur n'est pas utilisable par l'interface

L'API accepte `x-gnosis-access-token`, mais le frontend ne propose ni session ni mecanisme pour
l'envoyer. En production avec une cle OpenAI serveur protegee, l'UI integree ne peut donc generer
qu'en demandant a l'utilisateur sa propre cle. Cela contredit le README qui presente surtout une
cle serveur et l'architecture qui affirme que le frontend ne contient jamais de cle OpenAI.

Solution : choisir et documenter un modele :

- authentification utilisateur avec cle serveur et quotas ;
- ou BYO-key explicite, sans promesse que la cle reste hors navigateur ;
- ou acces prive avec authentification geree par le reverse proxy et transmission sure d'identite.

### P1 - La progression affichee n'est pas reelle

La liste d'etapes pendant le chargement est statique. Le plan et le resume du pipeline n'arrivent
qu'avec la reponse finale. L'utilisateur ne sait ni quelle etape tourne, ni si la requete progresse,
ni si un lot a echoue.

Solution : publier les transitions du job et la progression `lots termines / lots totaux` via
polling ou SSE.

### P1 - Validation pedagogique insuffisante

AJV valide bien la structure Kapsule, les identifiants et les index de quiz. En revanche, rien
n'assure que tous les sujets d'entree sont couverts, qu'une reponse de quiz est enseignee dans la
fiche, que les doublons semantiques sont absents ou que le contenu est factuellement correct.

Solution :

- calculer une matrice sujets -> fiches et refuser les sujets oublies ;
- ajouter des controles de coherence quiz/contenu ;
- conserver une mention claire que le deck est genere et doit etre relu ;
- constituer un petit jeu d'evaluation versionne sur plusieurs domaines techniques.

### P1 - Pas de test navigateur ni de vrai appel contractuel OpenAI

Les tests couvrent API mock, parsing et validation, mais pas l'interaction UI, les timeouts,
l'annulation, le telechargement, le responsive ou l'accessibilite. Aucun test optionnel ne detecte
une evolution du contrat Responses API ou du modele configure.

Solution : smoke test Playwright du parcours mock et test contractuel OpenAI manuel/programme avec
budget strict, sans l'executer sur toutes les PR.

### P2 - Image runtime inutilement volumineuse

React, Vite, le plugin React et `concurrently` sont declares comme dependances de production.
`npm prune --omit=dev` les conserve donc dans l'image runtime alors qu'ils ne sont necessaires qu'au
build ou au developpement.

Solution : deplacer l'outillage frontend et React dans `devDependencies`, verifier que le serveur
runtime ne charge que Express, OpenAI, AJV, CORS et dotenv, puis mesurer la taille d'image.

### P2 - En-tetes HTTP et erreurs de production

Express ne pose pas de CSP ni d'en-tetes de securite applicatifs. L'API renvoie directement
`error.message` et les details AJV. Le reverse proxy peut compenser les en-tetes, mais le contrat
n'est ni teste ni garanti hors de cette infrastructure.

Solution : definir les en-tetes dans l'app ou dans un snippet Caddy teste, et mapper les erreurs
internes vers des codes/messages publics stables.

### P2 - Supply chain perfectible

Images et actions sont referencees par tags mutables, sans SBOM, scan ni provenance signee.

Solution : pinner par digest/SHA, generer un SBOM et scanner l'image avant publication.

## Plan recommande

### Immediat

- Ajouter une CI de pull request.
- Limiter la concurrence et ramener `MAX_CARDS` de production a une valeur prudente.
- Aligner temporairement les timeouts pour eviter les echecs garantis a 120 secondes.

### Prochaine iteration

- Introduire le modele de job persistant avec progression et annulation.
- Choisir clairement le modele d'authentification/cles.
- Corriger l'identification client derriere Caddy.

### Ensuite

- Ajouter evaluation pedagogique et smoke test navigateur.
- Reduire l'image runtime et renforcer la supply chain.
- Ajouter metriques de cout, tokens, latence par etape et taux de reparation.

## Points forts a conserver

- Pipeline decoupe et sorties structurees strictes.
- Validation Kapsule locale avant export.
- Erreurs OpenAI typees, budgets de sortie et retries bornes.
- Conteneur multi-stage execute avec l'utilisateur `node`.
- Tests rapides, Logics propre et aucune vulnerabilite npm connue.
