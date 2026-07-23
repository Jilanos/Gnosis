## task_003_repondre_a_l_audit_technique_gnosis_du_2026_07_23 - Repondre a l'audit technique Gnosis du 2026-07-23
> From version: 0.1.0
> Schema version: 1.0
> Status: Done
> Understanding: 90%
> Confidence: 85%
> Progress: 100%
> Complexity: Medium
> Theme: Implementation delivery
> Reminder: Update status/understanding/confidence/progress and linked request/backlog references when you edit this doc.
> Owner: codex

# Definition of Done (DoD)
- [x] OpenAI SDK calls are bounded by explicit timeout/retry settings.
- [x] Frontend generation requests are bounded by `AbortController` or equivalent cancellation.
- [x] Incomplete/truncated OpenAI responses produce typed, actionable errors.
- [x] Deck generation has an explicit output-token budget and no longer relies on one unbounded final response.
- [x] Model configuration and production endpoint exposure are addressed or explicitly documented with a remaining-risk note.
- [x] Acceptance criteria are covered.
- [x] Validation passes.
- [x] Meaningful waves followed ADR 009: affected docs updated and the repo left commit-ready without automatic commits.

# Backlog
- `item_003_repondre_a_l_audit_technique_gnosis_du_2026_07_23`

# Acceptance criteria
- AC1: Configure the OpenAI client or per-call options with explicit timeout and retry policy.
- AC2: Add frontend timeout/cancellation around `/api/generate-deck` and expose a clear failure message.
- AC3: Update `parseOutput` so `response.status === "incomplete"`, missing `output_text`, and invalid JSON are handled with domain errors.
- AC4: Add `max_output_tokens` and implement or stage bounded deck generation by card/batch so large decks cannot silently produce truncated JSON.
- AC5: Verify the default model identifier and keep it configurable through environment/config.
- AC6: Add the minimal production guardrails for `/api/generate-deck`: auth/rate limiting and restricted CORS where applicable.
- AC7: Add or update tests for timeout config, incomplete response handling, invalid JSON handling and frontend cancellation behavior.

# Validation
- Run the existing application test suite in mock mode.
- Add focused tests for incomplete OpenAI responses and invalid JSON.
- Add focused frontend/API tests for timeout or cancellation behavior if the existing test stack supports it.
- Run `logics-manager lint --require-status`.
- Run `logics-manager audit --group-by-doc`.
- Use `logics-manager flow progress task logics/tasks/task_003_repondre_a_l_audit_technique_gnosis_du_2026_07_23.md --progress <n>%` during multi-wave work.
- Close with `logics-manager flow closeout logics/tasks/task_003_repondre_a_l_audit_technique_gnosis_du_2026_07_23.md --validation "<test evidence>" --lint --audit`.
- npm test passed: 12/12 tests. npm run build passed. logics-manager lint --require-status passed. logics-manager audit --group-by-doc passed before closeout with only deferred traceability warnings, now supplied in task AC Traceability.
- Finish workflow executed on 2026-07-23.
- Linked backlog/request close verification passed.

# Report
- Response chain created from `AUDIT.md`.
- Implementation should start with the three blocking findings: timeout/retry budgets, incomplete/truncated JSON handling, and bounded deck generation.
- Implemented audit response in `src/server/openai-pipeline.mjs`, `src/server/app.mjs`, `src/server/index.mjs`, `src/client/main.jsx`, `.env.example`, `test/pipeline.test.mjs` and `test/api.test.mjs`.
- Validation evidence: `npm test` passed 12/12 tests; `npm run build` passed; `logics-manager lint --require-status` passed.
- Finished on 2026-07-23.
- Linked backlog item(s): `item_003_repondre_a_l_audit_technique_gnosis_du_2026_07_23`
- Related request(s): `req_002_repondre_a_l_audit_technique_gnosis_du_2026_07_23`

# AI Context
- Summary: Implement the technical audit response for Gnosis by bounding OpenAI calls, handling incomplete JSON safely, reducing oversized deck generation risk and adding production guardrails.
- Keywords: audit-response, openai-timeout, retries, abort-controller, incomplete-response, max-output-tokens, cors, rate-limit
- Use when: You need the implementation task for `AUDIT.md` findings.
- Skip when: The change is unrelated to the Gnosis generation pipeline or audit response.

# Links
- Request: `req_002_repondre_a_l_audit_technique_gnosis_du_2026_07_23`
- Product brief(s): (none yet)
- Architecture decision(s): (none yet)

# AC Traceability
- request-AC1 -> This task. Proof: Audit blockers from `AUDIT.md` sections 1.1, 1.2 and 1.3 are addressed by explicit OpenAI timeout/retry settings, typed incomplete/invalid JSON errors, `max_output_tokens`, and batched deck generation. Source: `task_003_repondre_a_l_audit_technique_gnosis_du_2026_07_23`
- request-AC2 -> This task. Proof: Failure behavior is covered by typed pipeline errors and tests for incomplete OpenAI responses, invalid JSON, bounded structured calls, and production endpoint guardrails; `npm test` passed 12/12. Source: `task_003_repondre_a_l_audit_technique_gnosis_du_2026_07_23`
- request-AC3 -> This task. Proof: Model remains configurable through `OPENAI_MODEL`, production access is guarded by `GNOSIS_ACCESS_TOKEN` unless a user key is supplied or public mode is explicit, CORS is configurable, and rate limiting is applied to generation requests. Source: `task_003_repondre_a_l_audit_technique_gnosis_du_2026_07_23`
- request-AC4 -> This task. Proof: Validation evidence recorded in this task: `npm test` passed 12/12, `npm run build` passed, and Logics lint/audit were executed before closeout. Source: `task_003_repondre_a_l_audit_technique_gnosis_du_2026_07_23`
