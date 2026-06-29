import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { authors, users } from "@/db/schema";

const adminEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

/**
 * True if the email is an env super-admin (ADMIN_EMAILS). Env super-admins are
 * the bootstrap: they always have full access and are auto-provisioned into the
 * users table on first sign-in, so the first admin can then invite others.
 */
export function isAdminEmail(email?: string | null): boolean {
  return !!email && adminEmails.includes(email.toLowerCase());
}

/** Ensure an authors (byline) row exists for this email; return its id. */
async function ensureAuthor(
  email: string,
  name?: string | null,
  avatar?: string | null,
): Promise<number> {
  const existing = await db
    .select({ id: authors.id })
    .from(authors)
    .where(eq(authors.email, email))
    .limit(1);
  if (existing[0]) {
    await db
      .update(authors)
      .set({ name: name ?? undefined, avatar: avatar ?? undefined })
      .where(eq(authors.id, existing[0].id));
    return existing[0].id;
  }
  const inserted = await db
    .insert(authors)
    .values({ email, name: name ?? email, avatar: avatar ?? null })
    .returning({ id: authors.id });
  return inserted[0].id;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  pages: {
    signIn: "/admin/signin",
  },
  callbacks: {
    /**
     * Allow sign-in only for invited users (a users row exists & active) or env
     * super-admins. Provision/refresh the matching author byline and user row.
     */
    async signIn({ user }) {
      const email = user.email?.toLowerCase();
      if (!email) return false;

      const envAdmin = isAdminEmail(email);
      const rows = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
      const existing = rows[0];

      // Not invited and not an env super-admin → deny.
      if (!existing && !envAdmin) return false;
      // Deactivated accounts are denied (env super-admins always pass).
      if (existing && !existing.isActive && !envAdmin) return false;

      const authorId = await ensureAuthor(email, user.name, user.image);

      if (!existing) {
        // First sign-in of an env super-admin → create a full-admin user row.
        await db.insert(users).values({
          email,
          name: user.name ?? null,
          avatar: user.image ?? null,
          authorId,
          isAdmin: true,
          blogRole: "director",
          canManageRegistrations: true,
          canManageCourseDates: true,
        });
      } else {
        await db
          .update(users)
          .set({
            name: user.name ?? existing.name,
            avatar: user.image ?? existing.avatar,
            authorId: existing.authorId ?? authorId,
          })
          .where(eq(users.id, existing.id));
      }
      return true;
    },
  },
});
