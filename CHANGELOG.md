# Changelog

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
