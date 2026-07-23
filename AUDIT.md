# Audit & Review — Gnosis

_Date : 2026-07-23 · Branche `main` · 7/7 tests verts (mode mock)_

Revue de code avant commit/push. Priorité donnée au problème signalé :
**les appels OpenAI très longs qui finissent par crasher pendant les tests.**

---

## 1. Diagnostic du problème principal (appels API longs → crash)

Le pipeline enchaîne **5 appels OpenAI séquentiels** (+ 1 appel de réparation
éventuel), tous en `client.responses.create`. Plusieurs facteurs se combinent
pour produire des latences de plusieurs minutes puis un crash.

### 1.1 — Aucun timeout, nulle part 🔴 (cause racine)

| Couche | Fichier | État | Conséquence |
|--------|---------|------|-------------|
| SDK OpenAI | `openai-pipeline.mjs:38` | aucun `timeout` → défaut SDK **10 min/appel** | 5–6 appels ⇒ jusqu'à **~60 min** cumulés avant abandon |
| SDK OpenAI | `openai-pipeline.mjs:38` | aucun `maxRetries` explicite → défaut **2 retries** avec backoff | un 429/5xx transitoire triple la durée perçue avant l'échec |
| Express | `app.mjs:6` | aucun `server.timeout` / `requestTimeout` | la requête HTTP reste ouverte tant que le pipeline tourne |
| Frontend | `main.jsx:188` | `fetch` sans `AbortController` ni timeout | le spinner tourne indéfiniment ; onglet perçu comme « planté » |

> C'est le cœur du symptôme « très long puis crash » : rien ne borne la durée,
> et le SDK réessaie silencieusement, ce qui **allonge** encore avant l'erreur
> finale. En test réel (clé OpenAI, pas mock), un seul appel lent suffit à
> donner l'impression d'un gel, puis un timeout SDK non capturé remonte en 500.

**Recommandation :**
```js
// openai-pipeline.mjs — sur le client OU par appel
const client = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
  timeout: 60_000,   // 60 s / appel
  maxRetries: 1,
});
```
Et côté frontend, un `AbortController` avec un budget global (ex. 120 s) qui
coupe proprement et affiche un message actionnable.

### 1.2 — L'appel final « kapsule_deck » est démesuré 🔴

L'étape finale (`openai-pipeline.mjs:178-200`) demande au modèle de générer
**tout le deck en une seule réponse structurée** :

- `targetCards` par défaut = 8, **max 24** (`app.mjs:9`, `planSchema:205`) ;
- chaque fiche impose `sections minItems: 5` (`pipeline-schemas.mjs:249`) ;
- le prompt réclame des fiches « denses » et `card-metrics.mjs` vise
  **1500–1800 mots/fiche** (`MIN_CARD_WORDS`, `TARGET_CARD_WORDS`).

⇒ 8 fiches × ~1800 mots = **~14 000 mots** (≈ 25–40 k tokens de sortie) dans
**un seul** JSON structuré ; à 24 fiches, c'est intenable.

Conséquences directes :
- décodage structuré très lent (JSON strict + `strict: true`) ;
- risque de dépassement de la limite de tokens de sortie du modèle ;
- **`max_output_tokens` n'est jamais fixé** (`openai-pipeline.mjs:38`), donc
  aucune borne ⇒ réponse `incomplete` ⇒ JSON tronqué.

**Recommandation :** générer les fiches **par lot** (ou une par une, en
parallèle borné après l'étape `plan`), fixer `max_output_tokens`, et n'agréger
qu'après. Bonus : permet un vrai suivi de progression côté UI.

### 1.3 — JSON tronqué non détecté ⇒ crash brut 🔴

`parseOutput` (`openai-pipeline.mjs:31-35`) fait un `JSON.parse` direct et ne
teste que `!text`. Si la réponse est `incomplete` (limite de tokens atteinte —
scénario très probable vu 1.2), `output_text` est un JSON **partiel** :
`JSON.parse` lève une `SyntaxError` non typée qui remonte en 500 avec un
message cryptique. C'est exactement la forme d'un « crash ».

**Recommandation :**
```js
function parseOutput(response) {
  if (response.status === "incomplete") {
    throw new Error(`Réponse tronquée: ${response.incomplete_details?.reason}`);
  }
  const text = response.output_text;
  if (!text) throw new Error("OpenAI n'a retourné aucun JSON exploitable.");
  try { return JSON.parse(text); }
  catch { throw new Error("JSON OpenAI invalide (probablement tronqué)."); }
}
```

### 1.4 — Modèle par défaut à vérifier 🟠

Le défaut est `gpt-5.6` (`openai-pipeline.mjs:96`, `app.mjs:17`,
`.env.example:2`). Si cet identifiant n'existe pas sur le compte, **chaque**
appel réel échoue (après retries → lent puis crash). À confirmer avant tout
test réel ; sinon aligner sur un modèle valide et documenté.

### 1.5 — Aucune progression réelle → « crash » perçu 🟠

`LoadingState` (`main.jsx:470-483`) affiche une liste d'étapes **statique** ; le
`pipeline` summary n'est renvoyé qu'**après** la fin complète. Pendant les
minutes d'attente, l'utilisateur n'a aucun retour ⇒ perçoit un plantage.
Un flux d'étapes (SSE / streaming, ou au moins un appel par étape avec état)
améliorerait fortement le ressenti.

---

## 2. Sécurité & robustesse

| # | Sévérité | Constat | Fichier |
|---|----------|---------|---------|
| 2.1 | 🔴 | **Proxy OpenAI ouvert** : `/api/generate-deck` sans auth ni rate-limit. Si `OPENAI_API_KEY` serveur est présente, n'importe qui peut consommer le budget. | `app.mjs:23` |
| 2.2 | 🟠 | **CORS grand ouvert** (`cors()` sans `origin`). Combiné à 2.1, tout site tiers peut piloter le serveur. | `app.mjs:11` |
| 2.3 | 🟢 | La clé API utilisateur est **bien exclue** de la réponse (test `api.test.mjs:27` le vérifie). `store: false` OK. | `openai-pipeline.mjs:38` |
| 2.4 | 🟠 | Routage d'erreur fragile : `error.message.includes("OPENAI_API_KEY")` pour choisir le code 503. Un simple reformulage du message casse la logique. | `app.mjs:48` |
| 2.5 | 🟠 | **Une seule tentative de réparation** (`repairDeck`) ; si elle échoue, 422. Acceptable, mais à documenter comme limite. | `openai-pipeline.mjs:204-213` |
| 2.6 | 🟢 | Pas de logs serveur (hors message d'écoute) → diagnostic du « crash » difficile. Ajouter un log par étape + durée. | `index.mjs` |

**Reco prioritaire :** protéger l'endpoint (clé d'accès simple ou rate-limit
par IP) et restreindre CORS à l'origine du frontend en production.

---

## 3. Cohérence des schémas & métriques

- **Double schéma divergent** 🟠 : le deck est contraint deux fois, par
  `deckOutputSchema` (pipeline, `pipeline-schemas.mjs:224`) **et** par
  `kapsuleDeckSchema` (validation, `kapsule-schema.mjs`). Divergences réelles :
  - `sections` → `minItems: 5` (pipeline) vs `minItems: 1` (kapsule) ;
  - `quizQuestion.explanation` → **requis** (pipeline) vs **optionnel** (kapsule).
  Deux sources de vérité à maintenir ⇒ risque d'incohérence future. À
  factoriser (dériver le schéma de sortie du schéma Kapsule).
- **Calibrage vs densité demandée** 🟠 : `durationMin` est plafonné à 10
  (`kapsule-schema.mjs:45`) alors que 1800 mots ≈ 9,5 min de lecture seule.
  L'objectif « fiches denses » (prompt `openai-pipeline.mjs:190`) pousse
  mécaniquement vers de très gros volumes (voir §1.2). Décider : fiches courtes
  **ou** longues, mais pas « 1800 mots en ≤ 10 min ».

---

## 4. Points positifs

- Architecture claire, séparation nette serveur/pipeline/validation/client.
- Mode `GNOSIS_MOCK_OPENAI` / `NODE_ENV=test` bien pensé : tests rapides sans
  réseau, couvrant API + validation + métriques (7/7 verts).
- Validation locale AJV stricte + réparation ciblée : bonne intention.
- Clé API jamais renvoyée au client, `store: false`, entrées bornées
  (`compactTopics`, `clampInteger`).
- Slugs uniques et déterministes (`utils.mjs`).

---

## 5. Plan d'action recommandé (par priorité)

1. **[Bloquant tests réels]** Ajouter `timeout` + `maxRetries` au client OpenAI
   et un `AbortController` côté `fetch` (§1.1).
2. **[Bloquant]** Détecter `status: "incomplete"` et le JSON tronqué dans
   `parseOutput` (§1.3).
3. **[Bloquant]** Fixer `max_output_tokens` et **fractionner** la génération du
   deck (par fiche / par lot) au lieu d'un seul appel géant (§1.2).
4. **[Important]** Vérifier/aligner l'identifiant de modèle `gpt-5.6` (§1.4).
5. **[Important]** Protéger l'endpoint (auth/rate-limit) + restreindre CORS
   (§2.1, §2.2).
6. **[Qualité]** Unifier les deux schémas deck (§3), fiabiliser le routage
   d'erreur (§2.4), ajouter des logs par étape (§2.6).
7. **[UX]** Progression réelle du pipeline (streaming/SSE) (§1.5).

> Les points 1–3 traitent directement le symptôme « appels très longs qui
> crashent » et devraient être faits avant la prochaine campagne de tests réels.
