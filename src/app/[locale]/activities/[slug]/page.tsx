import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getContent } from "@/lib/content";
import { Markdown } from "@/components/Markdown";

const SITE_URL = "https://sabaimind.or.jp";

const activityFallbackDescriptions: Record<Locale, string> = {
  ja: "NPO法人サバイマインドが栃木・宇都宮周辺で行う、初心者にも参加しやすい瞑想とマインドフルネスの活動です。",
  en: "A beginner-friendly meditation and mindfulness activity from Sabai Mind NPO in Tochigi and the Utsunomiya area.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const item = getContent("activities", slug, locale);
  if (!item) return {};

  const title =
    slug === "utsunomiya-meditation-course" && locale === "ja"
      ? "宇都宮の初心者向け瞑想会｜仕事帰りにも参加できる瞑想体験"
      : item.meta.title;
  const description =
    item.meta.excerpt || activityFallbackDescriptions[locale];
  const url = `${SITE_URL}/${locale}/activities/${slug}`;
  const image =
    typeof item.meta.cover === "string"
      ? new URL(item.meta.cover, SITE_URL).toString()
      : `${SITE_URL}/opengraph-image.jpg`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ja: `${SITE_URL}/ja/activities/${slug}`,
        en: `${SITE_URL}/en/activities/${slug}`,
        "x-default": `${SITE_URL}/ja/activities/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "NPO法人サバイマインド",
      images: [{ url: image }],
    },
    twitter: {
      title,
      description,
      images: [image],
    },
  };
}

export default async function ActivityDetail({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = getDictionary(locale);
  const item = getContent("activities", slug, locale);
  if (!item) notFound();

  const openForRegistration = slug === "utsunomiya-meditation-course";

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
      {openForRegistration && (
        <div className="mb-12 flex justify-center">
          <Link
            href={`/${locale}/register`}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-10 py-4 font-label-md uppercase tracking-wide text-on-primary shadow-[0_10px_30px_-10px_rgb(124_87_31/0.6)] transition-all duration-200 hover:bg-primary-fixed-dim hover:text-on-primary-fixed active:translate-y-px"
          >
            <span className="material-symbols-outlined text-[20px]">
              event_available
            </span>
            {t.nav.register}
          </Link>
        </div>
      )}

      <div className="prose prose-zinc max-w-none prose-headings:font-display prose-headings:text-on-surface prose-p:font-body prose-p:text-on-surface-variant prose-a:text-primary prose-img:w-full prose-img:rounded-2xl prose-img:shadow-card prose-img:my-10">
        <Markdown source={item.body} />
      </div>

      {openForRegistration && (
        <section className="mt-16 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-8 md:p-10">
          <h2 className="mb-5 flex items-center gap-2 font-display text-headline-md text-secondary">
            <span className="material-symbols-outlined text-primary">
              location_on
            </span>
            {locale === "en" ? "Venue" : "会場"}
          </h2>
          <div className="font-body text-body-md leading-relaxed text-on-surface-variant">
            <p className="font-display text-headline-md text-on-surface">
              Sabai Mind（サバーイマインド）
            </p>
            <p className="mt-1">タイの瞑想と癒しの空間</p>
            <p className="mt-4 text-on-surface">タンマガーイ寺院 栃木別院 瞑想堂</p>
            <p className="mt-3">
              〒321-0345
              <br />
              栃木県宇都宮市大谷町1068
            </p>
          </div>
          <a
            href="https://maps.app.goo.gl/Toh6QxdayZbxiKKo6"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-outline-variant/50 px-6 py-2.5 font-label-md text-primary transition-colors hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-[20px]">map</span>
            {locale === "en" ? "Open in Maps" : "地図を見る"}
          </a>
        </section>
      )}

      {openForRegistration && (
        <div className="mt-16 rounded-2xl bg-secondary-fixed/40 p-8 text-center md:p-10">
          <h2 className="mb-2 font-display text-headline-md text-on-surface">
            {t.register.title}
          </h2>
          <p className="mb-6 font-body text-body-md text-on-surface-variant">
            {t.register.subtitle}
          </p>
          <Link
            href={`/${locale}/register`}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-10 py-4 font-label-md uppercase tracking-wide text-on-primary shadow-[0_10px_30px_-10px_rgb(124_87_31/0.6)] transition-all duration-200 hover:bg-primary-fixed-dim hover:text-on-primary-fixed active:translate-y-px"
          >
            {t.nav.register}
            <span className="material-symbols-outlined text-[18px]">
              arrow_forward
            </span>
          </Link>
        </div>
      )}
    </article>
  );
}
