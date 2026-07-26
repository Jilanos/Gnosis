# Changelog

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
