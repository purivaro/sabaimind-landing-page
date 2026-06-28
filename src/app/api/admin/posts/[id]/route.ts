import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const postId = Number(id);
  const data = await req.json();

  const existing = await db
    .select({ publishedAt: articles.publishedAt })
    .from(articles)
    .where(eq(articles.id, postId))
    .limit(1);
  if (existing.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isPublished = data.status === "published";
  // Keep the original publish date; set it the first time it goes live.
  const publishedAt = isPublished
    ? (existing[0].publishedAt ?? new Date())
    : null;

  try {
    await db
      .update(articles)
      .set({
        title: data.title?.trim(),
        body: data.body?.trim(),
        excerpt: data.excerpt?.trim() || null,
        coverImage: data.coverImage?.trim() || null,
        locale: data.locale === "en" ? "en" : "ja",
        slug: data.slug?.trim(),
        status: isPublished ? "published" : "draft",
        publishedAt,
        updatedAt: new Date(),
      })
      .where(eq(articles.id, postId));
    return NextResponse.json({ ok: true, id: postId });
  } catch {
    return NextResponse.json(
      { error: "Could not update post (slug may already exist)" },
      { status: 409 },
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await db.delete(articles).where(eq(articles.id, Number(id)));
  return NextResponse.json({ ok: true });
}
