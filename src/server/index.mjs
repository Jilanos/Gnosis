import "dotenv/config";
import { createApp } from "./app.mjs";

const port = Number(process.env.PORT || 8787);
const app = createApp(process.env);

app.listen(port, () => {
  console.log(`Gnosis API listening on http://127.0.0.1:${port}`);
});

