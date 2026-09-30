import { query } from "../db/index.js";

function formatUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    googleId: row.google_id,
    email: row.email,
    name: row.name,
    avatar: row.avatar,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const UserModel = {
  async findById(id) {
    const { rows } = await query("SELECT * FROM users WHERE id = $1", [id]);
    return formatUser(rows[0]);
  },

  async findByGoogleId(googleId) {
    const { rows } = await query("SELECT * FROM users WHERE google_id = $1", [
      googleId,
    ]);
    return formatUser(rows[0]);
  },

  async findByEmail(email) {
    const { rows } = await query("SELECT * FROM users WHERE email = $1", [
      email.toLowerCase().trim(),
    ]);
    return formatUser(rows[0]);
  },

  async upsertGoogleUser({ googleId, email, name, avatar }) {
    const normalizedEmail = email.toLowerCase().trim();
    const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    const { rows } = await query(
      `INSERT INTO users (id, google_id, email, name, avatar, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       ON CONFLICT (email) DO UPDATE SET
         google_id = COALESCE(users.google_id, EXCLUDED.google_id),
         name = EXCLUDED.name,
         avatar = COALESCE(EXCLUDED.avatar, users.avatar),
         updated_at = NOW()
       RETURNING *`,
      [id, googleId, normalizedEmail, name, avatar]
    );

    return formatUser(rows[0]);
  },

  async create({ id, email, name, avatar, googleId }) {
    const userId =
      id || `usr_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const { rows } = await query(
      `INSERT INTO users (id, google_id, email, name, avatar)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, googleId || null, email.toLowerCase().trim(), name, avatar || null]
    );
    return formatUser(rows[0]);
  },
};
