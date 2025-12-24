import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";
import fs from "fs";

const { Pool } = pg;

// In production (published apps), DATABASE_URL is stored in /tmp/replitdb
// In development, it's in process.env.DATABASE_URL
function getDatabaseUrl(): string {
  // First, try to read from /tmp/replitdb (production)
  try {
    if (fs.existsSync("/tmp/replitdb")) {
      const dbUrl = fs.readFileSync("/tmp/replitdb", "utf-8").trim();
      if (dbUrl) {
        console.log("Using DATABASE_URL from /tmp/replitdb (production)");
        return dbUrl;
      }
    }
  } catch (error) {
    console.log("Could not read /tmp/replitdb, falling back to env var");
  }

  // Fall back to environment variable (development)
  if (process.env.DATABASE_URL) {
    console.log("Using DATABASE_URL from environment variable (development)");
    return process.env.DATABASE_URL;
  }

  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const databaseUrl = getDatabaseUrl();
export const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle(pool, { schema });
