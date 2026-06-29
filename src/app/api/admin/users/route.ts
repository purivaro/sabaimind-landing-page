import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { users, authors } from "@/db/schema";
import { requireAdmin, normalizeBlogRole } from "@/lib/admin";

/** List all admin users joined with their byline (authors). */
export async function GET() {
  const me = await requireAdmin();
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      avatar: users.avatar,
      authorId: users.authorId,
      isActive: users.isActive,
      isAdmin: users.isAdmin,
      blogRole: users.blogRole,
      canManageRegistrations: users.canManageRegistrations,
      canManageCourseDates: users.canManageCourseDates,
      notifyRegistrations: users.notifyRegistrations,
      createdAt: users.createdAt,
      bylineName: authors.name,
      bylineBio: authors.bio,
    })
    .from(users)
    .leftJoin(authors, eq(users.authorId, authors.id))
    .orderBy(asc(users.id));
  return NextResponse.json({ users: rows });
}

/**
 * Invite a user by email. The byline author row is created/linked so they can
 * be a post author; they gain access on their first Google sign-in.
 */
export async function POST(req: Request) {
  const me = await requireAdmin();
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const d = await req.json().catch(() => null);
  if (!d) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const email = String(d.email ?? "").trim().toLowerCase();
  if (!email || !email.includes("@"))
    return NextResponse.json(
      { error: "有効なメールアドレスが必要です" },
      { status: 400 },
    );

  const bylineName = String(d.bylineName ?? d.name ?? "").trim() || email;
  const bylineBio = d.bylineBio ? String(d.bylineBio).trim() : null;

  // Ensure a byline author exists for this email (1:1 with the user).
  const existingAuthor = await db
    .select({ id: authors.id })
    .from(authors)
    .where(eq(authors.email, email))
    .limit(1);
  let authorId = existingAuthor[0]?.id ?? null;
  if (authorId == null) {
    const ins = await db
      .insert(authors)
      .values({ email, name: bylineName, bio: bylineBio })
      .returning({ id: authors.id });
    authorId = ins[0].id;
  } else {
    await db
      .update(authors)
      .set({ name: bylineName, bio: bylineBio })
      .where(eq(authors.id, authorId));
  }

  try {
    const [row] = await db
      .insert(users)
      .values({
        email,
        name: d.name ? String(d.name).trim() : bylineName,
        authorId,
        isActive: d.isActive === false ? false : true,
        isAdmin: !!d.isAdmin,
        blogRole: normalizeBlogRole(d.blogRole),
        canManageRegistrations: !!d.canManageRegistrations,
        canManageCourseDates: !!d.canManageCourseDates,
        notifyRegistrations: !!d.notifyRegistrations,
      })
      .returning({ id: users.id });
    return NextResponse.json({ ok: true, id: row.id }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "このメールアドレスは既に登録されています" },
      { status: 409 },
    );
  }
}
