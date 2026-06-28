import Link from "next/link";
import Image from "next/image";
import { type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getPublishedPosts } from "@/lib/blog";

export const dynamic = "force-dynamic";

function formatDate(d: Date | null) {
  if (!d) return "";
  return new Date(d).toISOString().slice(0, 10);
}

export default async function BlogIndex({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const posts = await getPublishedPosts(locale);

  return (
    <div className="mx-auto max-w-container-max px-margin-mobile py-20 md:px-margin-desktop md:py-28">
      <header className="mb-16 text-center">
        <h1 className="font-display text-display text-on-surface">{t.blog.title}</h1>
        <p className="mt-3 font-body text-body-lg text-on-surface-variant">
          {t.blog.subtitle}
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="py-20 text-center font-body text-body-md text-on-surface-variant">
          {t.blog.empty}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-gutter md:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/${locale}/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container-lowest shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
            >
              {post.coverImage ? (
                <div className="aspect-video overflow-hidden">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    width={600}
                    height={338}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="flex aspect-video items-center justify-center bg-secondary-fixed/30">
                  <span className="material-symbols-outlined text-5xl text-secondary">
                    article
                  </span>
                </div>
              )}
              <div className="flex flex-1 flex-col p-7">
                <span className="mb-3 block text-[10px] font-semibold uppercase tracking-widest text-secondary">
                  {formatDate(post.publishedAt)}
                </span>
                <h2 className="font-display text-headline-md text-on-surface">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="mt-3 line-clamp-3 font-body text-body-md text-on-surface-variant">
                    {post.excerpt}
                  </p>
                )}
                <span className="mt-5 inline-flex items-center gap-1 font-label-md uppercase tracking-wider text-primary">
                  {t.blog.readMore}
                  <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
