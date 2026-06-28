import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { authors } from "@/db/schema";

const adminEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

/** True if the email is on the admin allowlist (ADMIN_EMAILS env). */
export function isAdminEmail(email?: string | null): boolean {
  return !!email && adminEmails.includes(email.toLowerCase());
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  pages: {
    signIn: "/admin/signin",
  },
  callbacks: {
    // Only allowlisted Google accounts may sign in; upsert their author row.
    async signIn({ user }) {
      if (!isAdminEmail(user.email)) return false;
      const email = user.email!.toLowerCase();
      const existing = await db
        .select({ id: authors.id })
        .from(authors)
        .where(eq(authors.email, email))
        .limit(1);
      if (existing.length === 0) {
        await db.insert(authors).values({
          email,
          name: user.name ?? email,
          avatar: user.image ?? null,
        });
      }
      return true;
    },
  },
});
