import pg from "pg";
import { env } from "../config/env.js";

const { Pool } = pg;

// Initialize PostgreSQL pool (optimized for Neon serverless / pooler)
export const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: env.databaseUrl.includes("sslmode=require")
    ? { rejectUnauthorized: false }
    : undefined,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle PostgreSQL client", err);
});

/**
 * Execute a query with parameters
 */
export async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (env.nodeEnv === "development" && duration > 200) {
      console.log(`Slow query (${duration}ms):`, text);
    }
    return res;
  } catch (error) {
    console.error("Database query error:", { text, error: error.message });
    throw error;
  }
}

/**
 * Get a client from the pool for transactions
 */
export async function getClient() {
  return await pool.connect();
}
