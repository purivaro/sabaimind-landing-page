import { existsSync } from "node:fs";
import type { Config } from "drizzle-kit";

// drizzle-kit only auto-loads `.env`; Next.js uses `.env.local`. Load it here
// so `npm run db:*` sees DATABASE_URL without duplicating it into `.env`.
if (existsSync(".env.local")) process.loadEnvFile(".env.local");

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
