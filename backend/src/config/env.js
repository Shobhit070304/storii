import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend root
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const env = {
  port: parseInt(process.env.PORT || "5000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  databaseUrl: process.env.DATABASE_URL || "",
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  jwtSecret: process.env.JWT_SECRET || "storii_development_secret_key_123456789",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
};

// Simple sanity check
if (!env.databaseUrl && env.nodeEnv !== "test") {
  console.warn("⚠️ Warning: DATABASE_URL is not set in environment.");
}
