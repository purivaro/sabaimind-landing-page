import Link from "next/link";
import { notFound } from "next/navigation";
import { type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getContent } from "@/lib/content";
import { getYouTubeEmbed } from "@/lib/youtube";
import { Markdown } from "@/components/Markdown";

export default async function VideoDetail({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = getDictionary(locale);
  const item = getContent("videos", slug, locale);
  if (!item) notFound();

  const embed = item.meta.youtube ? getYouTubeEmbed(item.meta.youtube) : null;

  return (
    <article className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop py-16 md:py-24">
      <Link
        href={`/${locale}/videos`}
        className="inline-flex items-center gap-2 font-label-md text-primary mb-8 hover:opacity-70 transition-opacity uppercase tracking-wider"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        {t.nav.videos}
      </Link>
      <h1 className="font-display text-3xl md:text-headline-lg text-on-surface mb-8">
        {item.meta.title}
      </h1>
      {embed && (
        <div className="relative aspect-video overflow-hidden bg-on-surface mb-10 shadow-2xl">
          <iframe
            src={embed}
            title={item.meta.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
      )}
      <div className="prose prose-zinc max-w-none prose-headings:font-display prose-headings:text-on-surface prose-p:font-body prose-p:text-on-surface-variant prose-a:text-primary">
        <Markdown source={item.body} />
      </div>
    </article>
  );
}
