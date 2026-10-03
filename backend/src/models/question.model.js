import { query } from "../db/index.js";

export function formatQuestion(row) {
  if (!row) return null;
  const createdAtMs = new Date(row.created_at).getTime();

  return {
    id: row.id,
    title: row.title,
    body: row.body || "",
    category: row.category,
    authorId: row.author_id,
    authorName: row.anonymous ? "Anonymous" : row.author_name || "Anonymous",
    anonymous: Boolean(row.anonymous),
    answerCount: parseInt(row.answer_count || 0, 10),
    createdAt: createdAtMs,
    createdAtIso: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const QuestionModel = {
  async findAll({ category, q, sort = "recent", limit = 100, offset = 0 } = {}) {
    const conditions = [];
    const params = [];
    let paramIndex = 1;

    if (category && category !== "all") {
      conditions.push(`category = $${paramIndex++}`);
      params.push(category);
    }

    if (q && q.trim()) {
      conditions.push(
        `(title ILIKE $${paramIndex} OR body ILIKE $${paramIndex})`
      );
      params.push(`%${q.trim()}%`);
      paramIndex++;
    }

    if (sort === "open") {
      conditions.push("answer_count = 0");
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    let orderBy = "ORDER BY created_at DESC";
    if (sort === "answered") {
      orderBy = "ORDER BY answer_count DESC, created_at DESC";
    }

    const sql = `
      SELECT id, title, body, category, author_id, author_name, anonymous, answer_count, created_at, updated_at
      FROM questions
      ${whereClause}
      ${orderBy}
      LIMIT $${paramIndex++} OFFSET $${paramIndex}
    `;
    params.push(limit, offset);

    const { rows } = await query(sql, params);
    return rows.map(formatQuestion);
  },

  async findById(id) {
    const { rows } = await query(
      `SELECT id, title, body, category, author_id, author_name, anonymous, answer_count, created_at, updated_at
       FROM questions
       WHERE id = $1`,
      [id]
    );
    return formatQuestion(rows[0]);
  },

  async create({ title, body, category, authorId = null, authorName = "You", anonymous = false }) {
    const id = `q_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const { rows } = await query(
      `INSERT INTO questions (id, title, body, category, author_id, author_name, anonymous, answer_count, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 0, NOW(), NOW())
       RETURNING *`,
      [
        id,
        title.trim(),
        body?.trim() || null,
        category,
        authorId,
        authorName,
        Boolean(anonymous),
      ]
    );
    return formatQuestion(rows[0]);
  },

  async delete(id, authorId = null) {
    let sql = "DELETE FROM questions WHERE id = $1";
    const params = [id];

    if (authorId) {
      sql += " AND author_id = $2";
      params.push(authorId);
    }
    sql += " RETURNING id";

    const { rows } = await query(sql, params);
    return rows.length > 0;
  },

  async findByAuthorId(authorId) {
    const { rows } = await query(
      `SELECT id, title, body, category, author_id, author_name, anonymous, answer_count, created_at, updated_at
       FROM questions
       WHERE author_id = $1
       ORDER BY created_at DESC`,
      [authorId]
    );
    return rows.map(formatQuestion);
  },

  async updateAnswerCount(questionId) {
    const { rows } = await query(
      `UPDATE questions
       SET answer_count = (SELECT COUNT(*) FROM experiences WHERE question_id = $1),
           updated_at = NOW()
       WHERE id = $1
       RETURNING answer_count`,
      [questionId]
    );
    return rows[0] ? parseInt(rows[0].answer_count, 10) : 0;
  },

  async getStats() {
    const [qRes, aRes, uRes] = await Promise.all([
      query("SELECT COUNT(*) AS count FROM questions"),
      query("SELECT COUNT(*) AS count FROM experiences"),
      query(`
        SELECT COUNT(DISTINCT contributor) AS count FROM (
          SELECT author_name AS contributor FROM questions WHERE anonymous = false AND author_name IS NOT NULL AND author_name != ''
          UNION
          SELECT author_name AS contributor FROM experiences WHERE anonymous = false AND author_name IS NOT NULL AND author_name != ''
        ) AS unique_contributors
      `),
    ]);

    return {
      questions: parseInt(qRes.rows[0]?.count || 0, 10),
      experiences: parseInt(aRes.rows[0]?.count || 0, 10),
      contributors: parseInt(uRes.rows[0]?.count || 0, 10),
    };
  },
};
