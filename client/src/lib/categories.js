/**
 * Storii category definitions and tone color tokens.
 */
export const CATEGORIES = [
  {
    slug: "work",
    name: "Work & Career",
    blurb: "First jobs, hard managers, leaving, starting over.",
    prompt: "What do you wish you knew before your first job?",
    tone: "inkblue",
  },
  {
    slug: "money",
    name: "Money",
    blurb: "Salaries, debt, savings and the quiet financial lessons.",
    prompt: "What's a small money habit that changed your life?",
    tone: "moss",
  },
  {
    slug: "relationships",
    name: "Relationships",
    blurb: "Friendships, family, love, and the things left unsaid.",
    prompt: "How do you keep friendships alive when life gets busy?",
    tone: "plum",
  },
  {
    slug: "health",
    name: "Health & Body",
    blurb: "Sleep, burnout, diagnoses, learning to listen.",
    prompt: "What did your body try to tell you that you ignored?",
    tone: "vermillion",
  },
  {
    slug: "home",
    name: "Home & Moving",
    blurb: "New cities, first flats, living far from family.",
    prompt: "What helps most in your first month in a new city?",
    tone: "ochre",
  },
  {
    slug: "learning",
    name: "Learning",
    blurb: "Failing, retrying, and learning late in the day.",
    prompt: "How did you finally learn something you'd failed at twice?",
    tone: "inkblue",
  },
];

export const CATEGORY_MAP = CATEGORIES.reduce((map, category) => {
  map[category.slug] = category;
  return map;
}, {});

export function categoryBySlug(slug) {
  return CATEGORY_MAP[slug] || null;
}

export function categoryName(slug) {
  const category = categoryBySlug(slug);
  return category ? category.name : "Unfiled";
}

/** Inline style that exposes the category's accent colour as `--tone`. */
export function toneStyle(slug) {
  const category = categoryBySlug(slug);
  return { "--tone": `var(--${category ? category.tone : "ink"})` };
}
