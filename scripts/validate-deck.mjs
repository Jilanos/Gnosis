import { readFileSync } from "node:fs";
import { validateDeck, validationSummary } from "../src/server/validation.mjs";

const file = process.argv[2];
if (!file) {
  console.error("Usage: node scripts/validate-deck.mjs <deck.json>");
  process.exit(2);
}

const deck = JSON.parse(readFileSync(file, "utf8"));
const validation = validateDeck(deck);
console.log(validationSummary(validation));
process.exit(validation.valid ? 0 : 1);

