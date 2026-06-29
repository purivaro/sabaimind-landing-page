import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users, authors } from "@/db/schema";
import { requireAdmin, normalizeBlogRole } from "@/lib/admin";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const me = await requireAdmin();
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = Number((await params).id);

  const existing = (
    await db.select().from(users).where(eq(users.id, id)).limit(1)
  )[0];
  if (!existing)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const d = await req.json().catch(() => null);
  if (!d) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  // Guard against self-lockout: you can't demote or deactivate yourself.
  const isSelf = me.id != null && me.id === id;
  if (isSelf && (d.isAdmin === false || d.isActive === false))
    return NextResponse.json(
      { error: "自分自身の管理者権限・有効状態は変更できません" },
      { status: 400 },
    );

  const set: Record<string, unknown> = {};
  if (d.email !== undefined) {
    const email = String(d.email).trim().toLowerCase();
    if (!email.includes("@"))
      return NextResponse.json(
        { error: "有効なメールアドレスが必要です" },
        { status: 400 },
      );
    set.email = email;
  }
  if (d.name !== undefined) set.name = d.name ? String(d.name).trim() : null;
  if (d.isActive !== undefined) set.isActive = !!d.isActive;
  if (d.isAdmin !== undefined) set.isAdmin = !!d.isAdmin;
  if (d.blogRole !== undefined) set.blogRole = normalizeBlogRole(d.blogRole);
  if (d.canManageRegistrations !== undefined)
    set.canManageRegistrations = !!d.canManageRegistrations;
  if (d.canManageCourseDates !== undefined)
    set.canManageCourseDates = !!d.canManageCourseDates;

  // Byline (authors row) edits.
  if (existing.authorId && (d.bylineName !== undefined || d.bylineBio !== undefined)) {
    const aset: Record<string, unknown> = {};
    if (d.bylineName !== undefined && String(d.bylineName).trim())
      aset.name = String(d.bylineName).trim();
    if (d.bylineBio !== undefined)
      aset.bio = d.bylineBio ? String(d.bylineBio).trim() : null;
    if (Object.keys(aset).length)
      await db.update(authors).set(aset).where(eq(authors.id, existing.authorId));
  }

  if (Object.keys(set).length) {
    try {
      await db.update(users).set(set).where(eq(users.id, id));
    } catch {
      return NextResponse.json(
        { error: "このメールアドレスは既に使われています" },
        { status: 409 },
      );
    }
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const me = await requireAdmin();
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = Number((await params).id);

  if (me.id != null && me.id === id)
    return NextResponse.json(
      { error: "自分自身は削除できません" },
      { status: 400 },
    );

  // Remove the login only; the byline (authors) row is kept so existing post
  // bylines remain intact.
  await db.delete(users).where(eq(users.id, id));
  return NextResponse.json({ ok: true });
}
