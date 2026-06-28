import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getPublishedPost } from "@/lib/blog";

export const dynamic = "force-dynamic";

type Params = { locale: Locale; slug: string };

function formatDate(d: Date | null) {
  if (!d) return "";
  return new Date(d).toISOString().slice(0, 10);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return { title: "Not found" };

  const url = `/${locale}/blog/${post.slug}`;
  const images = post.coverImage ? [{ url: post.coverImage }] : undefined;
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.excerpt ?? undefined,
      images,
      publishedTime: post.publishedAt?.toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt ?? undefined,
      images,
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale, slug } = await params;
  const t = getDictionary(locale);
  const post = await getPublishedPost(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-margin-mobile py-20 md:py-28">
      <header className="mb-10">
        <span className="block text-label-md uppercase tracking-widest text-secondary">
          {formatDate(post.publishedAt)}
          {post.authorName ? ` — ${post.authorName}` : ""}
        </span>
        <h1 className="mt-4 font-display text-display leading-[1.15] text-on-surface">
          {post.title}
        </h1>
      </header>

      {post.coverImage && (
        <div className="mb-12 overflow-hidden rounded-2xl shadow-editorial">
          <Image
            src={post.coverImage}
            alt={post.title}
            width={1200}
            height={675}
            priority
            className="h-auto w-full object-cover"
          />
        </div>
      )}

      <div className="prose prose-zinc max-w-none prose-headings:font-display prose-a:text-primary">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
      </div>

      <div className="mt-16 border-t border-outline-variant/30 pt-8">
        <Link
          href={`/${locale}/blog`}
          className="inline-flex items-center gap-2 font-label-md uppercase tracking-wider text-primary hover:text-primary-fixed-dim"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          {t.blog.backToList}
        </Link>
      </div>
    </article>
  );
}
