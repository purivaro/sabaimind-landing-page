import "server-only";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { articles, authors } from "@/db/schema";
import type { Locale } from "@/i18n/config";

const postColumns = {
  id: articles.id,
  slug: articles.slug,
  locale: articles.locale,
  title: articles.title,
  body: articles.body,
  excerpt: articles.excerpt,
  coverImage: articles.coverImage,
  status: articles.status,
  createdAt: articles.createdAt,
  updatedAt: articles.updatedAt,
  publishedAt: articles.publishedAt,
  authorId: articles.authorId,
  authorName: authors.name,
  authorAvatar: authors.avatar,
};

export type BlogPost = {
  id: number;
  slug: string;
  locale: string;
  title: string;
  body: string;
  excerpt: string | null;
  coverImage: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  authorId: number | null;
  authorName: string | null;
  authorAvatar: string | null;
};

/** Published posts for a locale, newest first. */
export async function getPublishedPosts(locale: Locale): Promise<BlogPost[]> {
  return db
    .select(postColumns)
    .from(articles)
    .leftJoin(authors, eq(articles.authorId, authors.id))
    .where(and(eq(articles.status, "published"), eq(articles.locale, locale)))
    .orderBy(desc(articles.publishedAt));
}

/** Single published post by slug, or null. */
export async function getPublishedPost(slug: string): Promise<BlogPost | null> {
  const rows = await db
    .select(postColumns)
    .from(articles)
    .leftJoin(authors, eq(articles.authorId, authors.id))
    .where(and(eq(articles.slug, slug), eq(articles.status, "published")))
    .limit(1);
  return rows[0] ?? null;
}
