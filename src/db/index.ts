import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

type DB = ReturnType<typeof drizzle<typeof schema>>;

let _db: DB | null = null;

function getDb(): DB {
  if (_db) return _db;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Add your Neon/Vercel Postgres connection string to .env.local (and Vercel env vars).",
    );
  }
  _db = drizzle(neon(connectionString), { schema });
  return _db;
}

/**
 * Lazy DB proxy: importing `db` never connects, so `next build` stays green
 * before DATABASE_URL is provisioned. The connection is created on first use.
 */
export const db = new Proxy({} as DB, {
  get(_target, prop) {
    const instance = getDb() as unknown as Record<string | symbol, unknown>;
    const value = instance[prop];
    return typeof value === "function" ? value.bind(instance) : value;
  },
});

export { schema };
