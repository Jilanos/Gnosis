## req_012_reparer_l_appel_openai_annulable_et_rendre_les_echecs_de_generation_diagnosticables - Reparer l'appel OpenAI annulable et rendre les echecs de generation diagnosticables
> From version: 1.2.1
> Schema version: 1.0
> Status: Done
> Understanding: 90%
> Confidence: 85%
> Complexity: Medium
> Theme: Generation reliability
> Reminder: Update status/understanding/confidence and linked backlog/task references when you edit this doc.

# Needs
- Toute generation reelle echoue: `L'appel OpenAI a echoue.` sans aucun detail exploitable.
- L'utilisateur doit pouvoir generer un deck avec sa cle, et comprendre la cause quand un appel echoue.

# Context
- `callStructured` place `signal` dans le corps de `responses.create`, alors que le SDK l'attend dans les options de requete; OpenAI repond `HTTP 400 Unknown parameter: 'signal'`.
- Le job manager fournit toujours un `AbortController`, donc chaque generation reelle est rejetee des la normalisation; le mock et les tests, sans signal, ne voyaient rien.
- L'annulation n'etait donc jamais propagee a OpenAI, contrairement a ce que documente le README.
- Le message d'erreur remonte au client masquait le statut et le detail OpenAI, rendant le diagnostic impossible depuis l'interface.
- Mesure reelle avec `gpt-5.6`: un deck de 20 fiches demande environ 21 minutes; le plafond serveur de 60 s coupait l'etape Plan et le garde-fou client de 180 s annulait le job.

# Acceptance criteria
- AC1: Une generation reelle avec une cle valide aboutit, y compris lorsqu'un signal d'annulation est fourni.
- AC2: Le signal d'annulation est transmis comme option de requete et n'apparait jamais dans le corps envoye a OpenAI.
- AC3: Un echec OpenAI remonte le statut et le message amont, tronques, dans l'erreur affichee.
- AC4: Les plafonds de duree serveur et client couvrent la duree reelle d'une generation complete.

# Definition of Ready (DoR)
- [x] Problem statement is explicit and user impact is clear.
- [x] Scope boundaries (in/out) are explicit.
- [x] Acceptance criteria are testable.
- [x] Dependencies and known risks are listed.

# Backlog
- `item_021_reparer_l_appel_openai_annulable_et_rendre_les_echecs_de_generation_diagnosticables`
