import Link from "next/link";
import { notFound } from "next/navigation";
import { type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getContent } from "@/lib/content";
import { Markdown } from "@/components/Markdown";

export default async function NewsDetail({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = getDictionary(locale);
  const item = getContent("news", slug, locale);
  if (!item) notFound();

  return (
    <article className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-16 md:py-24">
      <Link
        href={`/${locale}/news`}
        className="inline-flex items-center gap-2 font-label-md text-primary mb-8 hover:opacity-70 transition-opacity uppercase tracking-wider"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        {t.nav.news}
      </Link>
      {item.meta.date && (
        <time className="text-label-md text-secondary block uppercase tracking-widest mb-4">
          {item.meta.date}
        </time>
      )}
      <h1 className="font-display text-4xl md:text-display text-on-surface mb-8">
        {item.meta.title}
      </h1>
      <div className="prose prose-zinc max-w-none prose-headings:font-display prose-headings:text-on-surface prose-p:font-body prose-p:text-on-surface-variant prose-a:text-primary">
        <Markdown source={item.body} />
      </div>
    </article>
  );
}
