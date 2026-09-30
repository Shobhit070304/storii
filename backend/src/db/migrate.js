import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pool, getClient } from "./index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MIGRATIONS_DIR = path.resolve(__dirname, "../../migrations");

export async function runMigrations() {
  console.log("🔄 Checking database migrations...");
  const client = await getClient();

  try {
    // 1. Ensure migrations table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // 2. Fetch already applied migrations
    const { rows: appliedRows } = await client.query(
      "SELECT name FROM schema_migrations ORDER BY id ASC"
    );
    const appliedSet = new Set(appliedRows.map((r) => r.name));

    // 3. Find all migration files
    if (!fs.existsSync(MIGRATIONS_DIR)) {
      console.log("No migrations folder found at", MIGRATIONS_DIR);
      return;
    }

    const files = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    let appliedCount = 0;

    for (const file of files) {
      if (appliedSet.has(file)) {
        continue;
      }

      console.log(`➡️  Applying migration: ${file}`);
      const filePath = path.join(MIGRATIONS_DIR, file);
      const sql = fs.readFileSync(filePath, "utf-8");

      await client.query("BEGIN");
      try {
        await client.query(sql);
        await client.query(
          "INSERT INTO schema_migrations (name) VALUES ($1)",
          [file]
        );
        await client.query("COMMIT");
        console.log(`✅ Applied migration: ${file}`);
        appliedCount++;
      } catch (err) {
        await client.query("ROLLBACK");
        console.error(`❌ Migration failed in ${file}:`, err.message);
        throw err;
      }
    }

    if (appliedCount === 0) {
      console.log("✨ All migrations are already up to date.");
    } else {
      console.log(`🎉 Successfully applied ${appliedCount} migration(s).`);
    }
  } finally {
    client.release();
  }
}

// Allow direct execution via `node src/db/migrate.js`
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runMigrations()
    .then(() => {
      console.log("Database migration finished.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Migration error:", err);
      process.exit(1);
    });
}
