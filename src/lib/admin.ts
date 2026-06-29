import "server-only";
import { eq } from "drizzle-orm";
import { auth, isAdminEmail } from "@/auth";
import { db } from "@/db";
import { authors, users } from "@/db/schema";

export type BlogRole = "none" | "writer" | "editor" | "director";

const BLOG_ROLES: readonly BlogRole[] = ["none", "writer", "editor", "director"];

/** Coerce any input to a valid blog role, defaulting to "none". */
export function normalizeBlogRole(v: unknown): BlogRole {
  const s = String(v ?? "none");
  return (BLOG_ROLES as readonly string[]).includes(s) ? (s as BlogRole) : "none";
}

/** Resolved identity + effective permissions for the signed-in admin user. */
export type Me = {
  id: number | null; // users.id (null only for a not-yet-provisioned env admin)
  email: string;
  name: string | null;
  authorId: number | null;
  isAdmin: boolean;
  blogRole: BlogRole;
  canWriteBlog: boolean;
  canManageRegistrations: boolean;
  canManageCourseDates: boolean;
};

/**
 * Resolve the current user from the session + users table. Env super-admins
 * (ADMIN_EMAILS) always get full access. Returns null if not signed in, not
 * invited, or deactivated.
 */
export async function getCurrentUser(): Promise<Me | null> {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase();
  if (!email) return null;

  const envAdmin = isAdminEmail(email);
  const rows = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  const u = rows[0];

  // Env super-admin not yet provisioned (provisioning happens at sign-in).
  if (!u) {
    if (!envAdmin) return null;
    return {
      id: null,
      email,
      name: session?.user?.name ?? null,
      authorId: null,
      isAdmin: true,
      blogRole: "director",
      canWriteBlog: true,
      canManageRegistrations: true,
      canManageCourseDates: true,
    };
  }
  if (!u.isActive && !envAdmin) return null;

  const isAdmin = u.isAdmin || envAdmin;
  const blogRole = normalizeBlogRole(u.blogRole);
  return {
    id: u.id,
    email,
    name: u.name,
    authorId: u.authorId,
    isAdmin,
    blogRole,
    canWriteBlog: isAdmin || blogRole !== "none",
    canManageRegistrations: isAdmin || u.canManageRegistrations,
    canManageCourseDates: isAdmin || u.canManageCourseDates,
  };
}

/** Gate: full admin (user management). Returns the user or null. */
export async function requireAdmin(): Promise<Me | null> {
  const me = await getCurrentUser();
  return me?.isAdmin ? me : null;
}

/** Gate: may write/manage the blog. */
export async function requireBlog(): Promise<Me | null> {
  const me = await getCurrentUser();
  return me?.canWriteBlog ? me : null;
}

/** Gate: may view/manage course registrations. */
export async function requireRegistrations(): Promise<Me | null> {
  const me = await getCurrentUser();
  return me?.canManageRegistrations ? me : null;
}

/** Gate: may manage course dates (cohorts). */
export async function requireCourseDates(): Promise<Me | null> {
  const me = await getCurrentUser();
  return me?.canManageCourseDates ? me : null;
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
