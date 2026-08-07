const WORDS_PER_MINUTE = 190;
// Planchers de lisibilite, jamais des volumes a atteindre: une fiche courte et
// juste est preferable a une fiche etiree pour approcher une cible.
const MIN_CARD_WORDS = 800;
const TARGET_CARD_WORDS = 1200;

function richTextFromSection(section) {
  if (!section || typeof section !== "object") return [];
  if (typeof section.content === "string") return [section.content];
  if (Array.isArray(section.items)) return section.items.filter((item) => typeof item === "string");
  if (Array.isArray(section.questions)) {
    return section.questions.flatMap((question) => [
      question.q,
      ...(Array.isArray(question.choices) ? question.choices : []),
      question.explanation,
    ]);
  }
  return [];
}

export function countWords(value) {
  return String(value ?? "")
    .replace(/[`*_~#[\]()>{}|-]/g, " ")
    .match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu)?.length ?? 0;
}

export function estimateCardMetrics(card) {
  const text = (card?.sections ?? []).flatMap(richTextFromSection).join(" ");
  const wordCount = countWords(text);
  const questionCount = (card?.sections ?? []).reduce(
    (sum, section) => sum + (section?.type === "quiz" ? (section.questions ?? []).length : 0),
    0,
  );
  const readingMinutes = Math.ceil(wordCount / WORDS_PER_MINUTE);
  const quizMinutes = Math.ceil(questionCount / 2);
  const calculatedDurationMin = Math.max(1, readingMinutes + quizMinutes);

  return {
    cardId: card?.id,
    title: card?.title,
    wordCount,
    questionCount,
    readingMinutes,
    quizMinutes,
    calculatedDurationMin,
    schemaDurationMin: Math.min(10, calculatedDurationMin),
    belowMinimum: wordCount < MIN_CARD_WORDS,
    belowTarget: wordCount < TARGET_CARD_WORDS,
  };
}

export function estimateDeckMetrics(deck) {
  const cards = (deck?.cards ?? []).map(estimateCardMetrics);
  const totalWords = cards.reduce((sum, card) => sum + card.wordCount, 0);
  const totalDurationMin = cards.reduce((sum, card) => sum + card.schemaDurationMin, 0);
  return {
    wordsPerMinute: WORDS_PER_MINUTE,
    minimumWordsPerCard: MIN_CARD_WORDS,
    targetWordsPerCard: TARGET_CARD_WORDS,
    totalWords,
    totalDurationMin,
    cards,
  };
}

export function applyCalculatedDurations(deck) {
  for (const card of deck?.cards ?? []) {
    card.durationMin = estimateCardMetrics(card).schemaDurationMin;
  }
  return deck;
}
