import { fileURLToPath } from "url";
import { query } from "./index.js";

const HOUR = 60 * 60 * 1000;
const now = Date.now();

export const INITIAL_USER = {
  id: "user_me",
  email: "rae.chen@storii.archive",
  name: "Rae Chen",
  avatar: null,
};

export const INITIAL_QUESTIONS = [
  {
    id: "q1",
    title: "What do you wish you knew before your first job?",
    body: "Starting my first proper job next month. Everyone gives advice about interviews, but nobody talks about the first week.",
    category: "work",
    authorId: "user_me",
    authorName: "Rae Chen",
    anonymous: false,
    answerCount: 2,
    createdAt: new Date(now - 26 * HOUR),
  },
  {
    id: "q2",
    title: "What's a small money habit that quietly changed your life?",
    body: "Not looking for budgeting apps or spreadsheets. I want the tiny thing you kept doing.",
    category: "money",
    authorId: null,
    authorName: "Jonah Feld",
    anonymous: false,
    answerCount: 1,
    createdAt: new Date(now - 52 * HOUR),
  },
  {
    id: "q3",
    title: "How do you keep friendships alive when everyone gets busy?",
    body: "My closest friends are spread across three time zones and we've drifted from weekly calls to twice a year.",
    category: "relationships",
    authorId: null,
    authorName: "Sam Ibarra",
    anonymous: false,
    answerCount: 1,
    createdAt: new Date(now - 73 * HOUR),
  },
  {
    id: "q4",
    title: "What did your body try to tell you that you ignored for too long?",
    body: "I've been tired for about a year and keep calling it a busy season.",
    category: "health",
    authorId: null,
    authorName: "Dee Marsh",
    anonymous: false,
    answerCount: 1,
    createdAt: new Date(now - 96 * HOUR),
  },
];

export const INITIAL_ANSWERS = [
  {
    id: "a1",
    questionId: "q1",
    body: 'Nobody expects you to know the unwritten rules on day one, but someone will still expect you to read their mind. I learned to ask "who should I check with on this?" instead of guessing. It made me look careful rather than lost.',
    context: "First job was a garden centre till, aged 16",
    authorId: null,
    authorName: "Dana W.",
    anonymous: false,
    createdAt: new Date(now - 22 * HOUR),
  },
  {
    id: "a2",
    questionId: "q1",
    body: 'The first three months are for listening, not proving. I kept a small notebook and wrote down every name, every acronym and every "that\'s just how we do it here."',
    context: "Fifteen years across three industries",
    authorId: null,
    authorName: "Marcus Oyelaran",
    anonymous: false,
    createdAt: new Date(now - 19 * HOUR),
  },
  {
    id: "a3",
    questionId: "q2",
    body: "The day my salary landed I moved 1% of it to a separate account. Not 10%. One percent. Small enough that I never missed it, and after three years it became an emergency fund that let me say no to a bad job.",
    context: "Freelance designer, five lean years",
    authorId: null,
    authorName: "Rosa T.",
    anonymous: false,
    createdAt: new Date(now - 44 * HOUR),
  },
  {
    id: "a4",
    questionId: "q3",
    body: "We started a voice-note thread instead of texting. Hearing a real voice while folding laundry kept us close through two relocations and a baby.",
    context: "Best friend moved 4,000 miles away",
    authorId: "user_me",
    authorName: "Rae Chen",
    anonymous: false,
    createdAt: new Date(now - 36 * HOUR),
  },
  {
    id: "a5",
    questionId: "q4",
    body: "I thought I was lazy. It was low iron. One blood test and I felt like a different person within six weeks.",
    context: "Vegetarian, ran a café, age 31",
    authorId: null,
    authorName: "Han P.",
    anonymous: false,
    createdAt: new Date(now - 80 * HOUR),
  },
];

export async function seedDatabase(force = false) {
  console.log("🌱 Checking database seed...");

  // Check if questions already exist
  const { rows } = await query("SELECT COUNT(*) AS count FROM questions");
  const count = parseInt(rows[0].count, 10);

  if (count > 0 && !force) {
    console.log(`ℹ️  Database already contains ${count} question(s). Skipping seed.`);
    return;
  }

  console.log("🚀 Seeding initial dummy data into PostgreSQL...");

  // 1. Seed demo user
  await query(
    `INSERT INTO users (id, email, name, avatar)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name`,
    [INITIAL_USER.id, INITIAL_USER.email, INITIAL_USER.name, INITIAL_USER.avatar]
  );

  // 2. Seed questions
  for (const q of INITIAL_QUESTIONS) {
    await query(
      `INSERT INTO questions (id, title, body, category, author_id, author_name, anonymous, answer_count, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (id) DO NOTHING`,
      [
        q.id,
        q.title,
        q.body,
        q.category,
        q.authorId,
        q.authorName,
        q.anonymous,
        q.answerCount,
        q.createdAt,
      ]
    );
  }

  // 3. Seed experiences (answers)
  for (const a of INITIAL_ANSWERS) {
    await query(
      `INSERT INTO experiences (id, question_id, body, context, author_id, author_name, anonymous, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id) DO NOTHING`,
      [
        a.id,
        a.questionId,
        a.body,
        a.context,
        a.authorId,
        a.authorName,
        a.anonymous,
        a.createdAt,
      ]
    );
  }

  // 4. Update answer counts based on actual records
  await query(`
    UPDATE questions q
    SET answer_count = (
      SELECT COUNT(*) FROM experiences e WHERE e.question_id = q.id
    )
  `);

  console.log("✅ Seed completed successfully!");
}

// Allow direct execution via `node src/db/seed.js`
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedDatabase(true)
    .then(() => {
      console.log("Seed script finished.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Seed error:", err);
      process.exit(1);
    });
}
