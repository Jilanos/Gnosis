import "dotenv/config";
import { createApp } from "./app.mjs";
import { clampInteger } from "./utils.mjs";

const port = Number(process.env.PORT || 8787);
const app = createApp(process.env);

const server = app.listen(port, () => {
  console.log(`Gnosis API listening on http://127.0.0.1:${port}`);
});

server.requestTimeout = clampInteger(process.env.HTTP_REQUEST_TIMEOUT_MS, 30_000, 900_000, 180_000);
server.headersTimeout = clampInteger(
  process.env.HTTP_HEADERS_TIMEOUT_MS,
  5_000,
  server.requestTimeout,
  65_000,
);
server.timeout = clampInteger(process.env.HTTP_SOCKET_TIMEOUT_MS, 30_000, 900_000, 180_000);
