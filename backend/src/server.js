import { app } from "./app.js";
import { env } from "./config/env.js";
import { runMigrations } from "./db/migrate.js";
import { seedDatabase } from "./db/seed.js";
import { pool } from "./db/index.js";

async function startServer() {
  try {
    console.log("==========================================");
    console.log("   📖 Starting Storii Backend Server       ");
    console.log("==========================================");

    // 1. Run migrations automatically on boot
    if (env.databaseUrl) {
      try {
        await runMigrations();
        // 2. Automatically seed if database is empty
        await seedDatabase(false);
      } catch (dbErr) {
        console.error("⚠️ Database initialization warning:", dbErr.message);
        console.error("Server will continue running, but DB queries may fail until fixed.");
      }
    } else {
      console.warn("⚠️ DATABASE_URL not provided. Skipping migrations and seeds.");
    }

    // 3. Start listening
    const server = app.listen(env.port, () => {
      console.log(`🚀 Storii API server running at http://localhost:${env.port}`);
      console.log(`🌐 Allowed Client URL: ${env.clientUrl}`);
      console.log(`🔌 Health check: http://localhost:${env.port}/api/health`);
      console.log("==========================================");
    });

    // Graceful shutdown
    const shutdown = async (signal) => {
      console.log(`\nReceived ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        try {
          await pool.end();
          console.log("PostgreSQL connection pool closed.");
        } catch (e) {
          console.error("Error closing PostgreSQL pool:", e);
        }
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    console.error("Fatal startup error:", error);
    process.exit(1);
  }
}

startServer();
