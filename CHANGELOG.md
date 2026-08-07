# Changelog

## 1.2.1 - 2026-08-07

- Create `/app/data` in the runtime image and give it to the `node` user, so generation jobs can be persisted instead of failing with `EACCES: permission denied, mkdir '/app/data'`.
- Exclude `data` from the Docker build context.

## 1.2.0 - 2026-08-07

- Remove the target card count from the API contract, the pipeline prompts and the mock: the plan now derives the minimal number of cards from the pedagogical coverage.
- Add a planning contract to the plan schema: card origin, source topic, autonomy reason, plus a plan summary listing merged topics, justified prerequisites and rejected extensions.
- Accept `low` / `medium` / `advanced` as level aliases and make the level the only explicit pedagogical intensity; the manual density option is gone.
- Keep `MAX_CARDS` as a technical ceiling only, traced in the plan summary when it truncates.
- Show the planning summary in the client and drop the target-card and density controls from the form.

## 1.1.9 - 2026-08-07

- Fix the initial client render by importing the `Brain` Lucide icon used by the empty state.

## 1.1.8 - 2026-08-06

- Replace the Gnosis, Kapsule and Paul Mondou client assets with the corrected Icones V3 masters.
- Reuse the single Gnosis master for both the emblem and the icon, in each theme variant.
- Downscale every asset to its display size, cutting the bundled assets from 7.8 MB to 626 kB.

## 1.1.7 - 2026-08-06

- Document the published Icones V3 assets in the Logics workflow records; no runtime change.

## 1.1.6 - 2026-08-05

- Replace the Gnosis favicon and app emblem with Icones V3 assets.
- Replace the Kapsule and Paul Mondou navigation link icons with Icones V3 assets.
- Record the Logics release contract for tagged production delivery.

## 1.1.3 - 2026-07-26

- Use the release workflow's ephemeral GitHub token to authenticate the VPS to GHCR.

## 1.1.2 - 2026-07-26

- Fail tagged deployments when the GHCR image cannot be pulled instead of rebuilding an unchecked local source tree.
- Persist and verify the deployed Gnosis version through the public health endpoint.
- Forward the GHCR deployment credentials to the VPS release command.

## 1.1.1 - 2026-07-26

- Install the native build toolchain required by `better-sqlite3` in the Docker build stage.

## 1.1.0 - 2026-07-26

- Federation with shared Kapsule and ClaimLens accounts.
- Reuse of encrypted per-user OpenAI keys stored by ClaimLens.
- Non-persistent guest keys and owner-scoped generation jobs.
- Conditional OpenAI key field, visible application version, and paulmondou.fr link.
- CSRF-protected session actions and compatibility tests.
