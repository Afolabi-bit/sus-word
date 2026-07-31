export interface WordEntry {
  word: string;
  category: string;
}

const WORD_LIST: WordEntry[] = [
  // Animals
  { word: "Dolphin", category: "Animals" },
  { word: "Penguin", category: "Animals" },
  { word: "Elephant", category: "Animals" },
  { word: "Butterfly", category: "Animals" },
  { word: "Octopus", category: "Animals" },
  { word: "Giraffe", category: "Animals" },
  { word: "Parrot", category: "Animals" },
  { word: "Turtle", category: "Animals" },
  { word: "Rabbit", category: "Animals" },
  { word: "Flamingo", category: "Animals" },

  // Food & Drink
  { word: "Pancake", category: "Food" },
  { word: "Sushi", category: "Food" },
  { word: "Chocolate", category: "Food" },
  { word: "Popcorn", category: "Food" },
  { word: "Lemonade", category: "Food" },
  { word: "Pretzel", category: "Food" },
  { word: "Mango", category: "Food" },
  { word: "Cinnamon", category: "Food" },
  { word: "Avocado", category: "Food" },
  { word: "Marshmallow", category: "Food" },

  // Nature & Plants
  { word: "Lily", category: "Nature" },
  { word: "Sunflower", category: "Nature" },
  { word: "Rainbow", category: "Nature" },
  { word: "Volcano", category: "Nature" },
  { word: "Waterfall", category: "Nature" },
  { word: "Coral", category: "Nature" },
  { word: "Glacier", category: "Nature" },
  { word: "Dandelion", category: "Nature" },

  // Everyday Objects
  { word: "Clock", category: "Everyday Objects" },
  { word: "Umbrella", category: "Everyday Objects" },
  { word: "Candle", category: "Everyday Objects" },
  { word: "Mirror", category: "Everyday Objects" },
  { word: "Blanket", category: "Everyday Objects" },
  { word: "Compass", category: "Everyday Objects" },
  { word: "Hammock", category: "Everyday Objects" },
  { word: "Lantern", category: "Everyday Objects" },
  { word: "Telescope", category: "Everyday Objects" },
  { word: "Backpack", category: "Everyday Objects" },

  // Places & Experiences
  { word: "Vacation", category: "Places" },
  { word: "Lighthouse", category: "Places" },
  { word: "Carnival", category: "Places" },
  { word: "Library", category: "Places" },
  { word: "Treehouse", category: "Places" },
  { word: "Castle", category: "Places" },
  { word: "Market", category: "Places" },
  { word: "Airport", category: "Places" },
];

/**
 * Returns a random word entry from the full word list.
 * Categories can be filtered in a future update.
 */
export function getRandomWord(): WordEntry {
  const index = Math.floor(Math.random() * WORD_LIST.length);
  return WORD_LIST[index];
}

/** Returns all available categories. */
export function getCategories(): string[] {
  return [...new Set(WORD_LIST.map((w) => w.category))];
}

export { WORD_LIST };
