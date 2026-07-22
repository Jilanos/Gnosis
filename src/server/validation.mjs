import Ajv from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { kapsuleDeckSchema } from "./kapsule-schema.mjs";

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const validateStructure = ajv.compile(kapsuleDeckSchema);

function formatAjvError(err) {
  const path = err.instancePath || "(racine)";
  let message = err.message ?? "invalide";
  if (err.keyword === "additionalProperties") {
    message = `propriete non autorisee "${err.params.additionalProperty}"`;
  } else if (err.keyword === "enum") {
    message = `valeur invalide, attendu l'une de : ${err.params.allowedValues.join(", ")}`;
  } else if (err.keyword === "const") {
    message = `doit valoir ${JSON.stringify(err.params.allowedValue)}`;
  } else if (err.keyword === "oneOf") {
    message =
      "ne correspond a aucun type de section connu (intro, concept, example, takeaways, quiz)";
  }
  return { path, message };
}

function semanticErrors(deck) {
  const errors = [];
  const seenCardIds = new Set();

  for (const [cardIndex, card] of (deck.cards ?? []).entries()) {
    const cardPath = `/cards/${cardIndex}`;
    if (card && typeof card.id === "string") {
      if (seenCardIds.has(card.id)) {
        errors.push({
          path: `${cardPath}/id`,
          message: `identifiant de fiche duplique "${card.id}"`,
        });
      }
      seenCardIds.add(card.id);
    }

    for (const [sectionIndex, section] of (card?.sections ?? []).entries()) {
      if (section?.type !== "quiz") continue;
      for (const [questionIndex, question] of (section.questions ?? []).entries()) {
        const qPath = `${cardPath}/sections/${sectionIndex}/questions/${questionIndex}`;
        if (
          Array.isArray(question?.choices) &&
          typeof question.answer === "number" &&
          question.answer >= question.choices.length
        ) {
          errors.push({
            path: `${qPath}/answer`,
            message: `index de reponse ${question.answer} hors limites (${question.choices.length} choix)`,
          });
        }
      }
    }
  }

  return errors;
}

export function validateDeck(deck) {
  const structureOk = validateStructure(deck);
  const errors = structureOk ? [] : (validateStructure.errors ?? []).map(formatAjvError);

  if (structureOk) {
    errors.push(...semanticErrors(deck));
  }

  return { valid: errors.length === 0, errors };
}

export function assertDeck(deck) {
  const validation = validateDeck(deck);
  if (!validation.valid) {
    const error = new Error("Deck Kapsule invalide.");
    error.validation = validation;
    throw error;
  }
  return validation;
}

export function validationSummary(validation) {
  if (validation.valid) return "Deck valide.";
  return validation.errors.map((error) => `${error.path}: ${error.message}`).join("\n");
}

