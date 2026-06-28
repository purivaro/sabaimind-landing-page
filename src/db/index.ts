import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  // Surfaced clearly during local dev / build if the env var is missing.
  throw new Error(
    "DATABASE_URL is not set. Add your Neon/Vercel Postgres connection string to .env.local (and Vercel env vars).",
  );
}

const sql = neon(connectionString);

export const db = drizzle(sql, { schema });
export { schema };
