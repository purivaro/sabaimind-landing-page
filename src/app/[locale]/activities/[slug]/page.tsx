import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getContent } from "@/lib/content";
import { Markdown } from "@/components/Markdown";

export default async function ActivityDetail({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = getDictionary(locale);
  const item = getContent("activities", slug, locale);
  if (!item) notFound();

  return (
    <article className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-16">
      <Link
        href={`/${locale}/activities`}
        className="inline-flex items-center gap-2 font-label-md text-primary mb-8 hover:opacity-70 transition-opacity uppercase tracking-wider"
      >
        <span className="material-symbols-outlined text-[18px]">
          arrow_back
        </span>
        {t.nav.activities}
      </Link>
      {item.meta.date && (
        <time className="text-label-md text-secondary block uppercase tracking-widest mb-4">
          {item.meta.date}
        </time>
      )}
      <h1 className="font-display text-4xl md:text-display text-on-surface mb-8">
        {item.meta.title}
      </h1>
      {item.meta.cover && (
        <div className="relative w-full mb-12 overflow-hidden rounded-lg shadow-[0_12px_32px_rgba(124,87,31,0.10)] border border-outline-variant/20 bg-surface-container">
          <Image
            src={item.meta.cover}
            alt={item.meta.title}
            width={1600}
            height={900}
            className="w-full h-auto object-contain"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>
      )}
      <div className="prose prose-zinc max-w-none prose-headings:font-display prose-headings:text-on-surface prose-p:font-body prose-p:text-on-surface-variant prose-a:text-primary">
        <Markdown source={item.body} />
      </div>
    </article>
  );
}
