import "server-only";
import { eq } from "drizzle-orm";
import { auth, isAdminEmail } from "@/auth";
import { db } from "@/db";
import { authors } from "@/db/schema";
import type { Session } from "next-auth";

/** Returns the session if the caller is an allowlisted admin, else null. */
export async function requireAdmin(): Promise<Session | null> {
  const session = await auth();
  if (!isAdminEmail(session?.user?.email)) return null;
  return session;
}

/** Author row id for a signed-in admin (created on first sign-in). */
export async function getAuthorIdByEmail(email: string): Promise<number | null> {
  const rows = await db
    .select({ id: authors.id })
    .from(authors)
    .where(eq(authors.email, email.toLowerCase()))
    .limit(1);
  return rows[0]?.id ?? null;
}

/** ASCII slug + short random suffix. Non-ASCII titles fall back to "post-xxxxx". */
export function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  const rand = Math.random().toString(36).slice(2, 7);
  return `${base || "post"}-${rand}`;
}
