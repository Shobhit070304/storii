import { query } from "../db/index.js";
import { QuestionModel } from "./question.model.js";

export function formatExperience(row) {
  if (!row) return null;
  const createdAtMs = new Date(row.created_at).getTime();

  return {
    id: row.id,
    questionId: row.question_id,
    body: row.body,
    context: row.context || "",
    authorId: row.author_id,
    authorName: row.anonymous ? "Anonymous" : row.author_name || "Anonymous",
    anonymous: Boolean(row.anonymous),
    createdAt: createdAtMs,
    createdAtIso: row.created_at,
    updatedAt: row.updated_at,
    ...(row.question_title
      ? {
          question: {
            id: row.question_id,
            title: row.question_title,
            category: row.question_category,
          },
        }
      : {}),
  };
}

export const ExperienceModel = {
  async findByQuestionId(questionId) {
    const { rows } = await query(
      `SELECT id, question_id, body, context, author_id, author_name, anonymous, created_at, updated_at
       FROM experiences
       WHERE question_id = $1
       ORDER BY created_at ASC`,
      [questionId]
    );
    return rows.map(formatExperience);
  },

  async findById(id) {
    const { rows } = await query(
      `SELECT id, question_id, body, context, author_id, author_name, anonymous, created_at, updated_at
       FROM experiences
       WHERE id = $1`,
      [id]
    );
    return formatExperience(rows[0]);
  },

  async create({
    questionId,
    body,
    context,
    authorId = null,
    authorName = "You",
    anonymous = false,
  }) {
    const id = `a_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const { rows } = await query(
      `INSERT INTO experiences (id, question_id, body, context, author_id, author_name, anonymous, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
       RETURNING *`,
      [
        id,
        questionId,
        body.trim(),
        context?.trim() || null,
        authorId,
        authorName,
        Boolean(anonymous),
      ]
    );

    // Update parent question answer count
    await QuestionModel.updateAnswerCount(questionId);

    return formatExperience(rows[0]);
  },

  async delete(id, authorId = null) {
    // Find experience first to get question_id
    const exp = await this.findById(id);
    if (!exp) return false;

    let sql = "DELETE FROM experiences WHERE id = $1";
    const params = [id];

    if (authorId) {
      sql += " AND author_id = $2";
      params.push(authorId);
    }
    sql += " RETURNING id";

    const { rows } = await query(sql, params);
    if (rows.length > 0) {
      await QuestionModel.updateAnswerCount(exp.questionId);
      return true;
    }
    return false;
  },

  async findByAuthorId(authorId) {
    const { rows } = await query(
      `SELECT e.id, e.question_id, e.body, e.context, e.author_id, e.author_name, e.anonymous, e.created_at, e.updated_at,
              q.title AS question_title, q.category AS question_category
       FROM experiences e
       LEFT JOIN questions q ON e.question_id = q.id
       WHERE e.author_id = $1
       ORDER BY e.created_at DESC`,
      [authorId]
    );
    return rows.map(formatExperience);
  },
};
