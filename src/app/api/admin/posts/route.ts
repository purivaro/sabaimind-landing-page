import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { articles, authors } from "@/db/schema";
import { requireBlog, getAuthorIdByEmail, slugify } from "@/lib/admin";

export async function GET() {
  const me = await requireBlog();
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const posts = await db
    .select({
      id: articles.id,
      slug: articles.slug,
      locale: articles.locale,
      title: articles.title,
      status: articles.status,
      updatedAt: articles.updatedAt,
      publishedAt: articles.publishedAt,
      authorName: authors.name,
    })
    .from(articles)
    .leftJoin(authors, eq(articles.authorId, authors.id))
    .orderBy(desc(articles.updatedAt));

  return NextResponse.json({ posts });
}

export async function POST(req: Request) {
  const me = await requireBlog();
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const title = (data.title ?? "").trim();
  const body = (data.body ?? "").trim();
  if (!title || !body) {
    return NextResponse.json({ error: "Title and body are required" }, { status: 400 });
  }

  const authorId = me.authorId ?? (await getAuthorIdByEmail(me.email));
  const slug = (data.slug ?? "").trim() || slugify(title);
  const isPublished = data.status === "published";

  try {
    const [row] = await db
      .insert(articles)
      .values({
        title,
        body,
        excerpt: data.excerpt?.trim() || null,
        coverImage: data.coverImage?.trim() || null,
        locale: data.locale === "en" ? "en" : "ja",
        slug,
        status: isPublished ? "published" : "draft",
        authorId,
        publishedAt: isPublished ? new Date() : null,
      })
      .returning({ id: articles.id, slug: articles.slug });
    return NextResponse.json({ ok: true, id: row.id, slug: row.slug });
  } catch {
    return NextResponse.json(
      { error: "Could not create post (slug may already exist)" },
      { status: 409 },
    );
  }
}
