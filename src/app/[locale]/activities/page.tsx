import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getAllContent } from "@/lib/content";

const SITE_URL = "https://sabaimind.or.jp";

const activitiesSeo: Record<Locale, { title: string; description: string }> = {
  ja: {
    title: "栃木・宇都宮の瞑想体験・イベント",
    description:
      "宇都宮の初心者向け瞑想会、自然の中で心を整える体験、地域交流イベントをご案内します。初めての方も安心して参加できます。",
  },
  en: {
    title: "Meditation Activities in Tochigi and Utsunomiya | Sabai Mind NPO",
    description:
      "Explore beginner-friendly meditation sessions, mindfulness activities, and community events from Sabai Mind NPO in Tochigi and Utsunomiya.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = activitiesSeo[locale];
  const url = `${SITE_URL}/${locale}/activities`;

  return {
    metadataBase: new URL(SITE_URL),
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: url,
      languages: {
        ja: `${SITE_URL}/ja/activities`,
        en: `${SITE_URL}/en/activities`,
        "x-default": `${SITE_URL}/ja/activities`,
      },
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url,
      siteName: "NPO法人サバーイマインド",
    },
    twitter: {
      title: seo.title,
      description: seo.description,
    },
  };
}

export default async function ActivitiesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const items = getAllContent("activities", locale);

  return (
    <main className="py-16 md:py-24 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
      {/* Header */}
      <header className="mb-16 text-center max-w-2xl mx-auto">
        <h1 className="font-display text-4xl md:text-[48px] font-bold text-primary mb-4 leading-tight">
          {t.activities.title}
        </h1>
        <p className="text-on-surface-variant font-body text-body-md leading-relaxed">
          {t.activities.subtitle}
        </p>
      </header>

      {items.length === 0 ? (
        <p className="text-center text-on-surface-variant py-24">
          {locale === "ja" ? "現在予定されているイベントはありません。" : "ยังไม่มีกิจกรรมในขณะนี้"}
        </p>
      ) : (
        <div className="mx-auto flex max-w-4xl flex-col gap-10">
          {items.map((item, idx) => (
            <Link
              key={item.slug}
              href={`/${locale}/activities/${item.slug}`}
              className="group flex flex-col overflow-hidden rounded-lg border border-outline-variant/10 bg-surface-container-lowest shadow-[0_12px_24px_rgba(200,155,92,0.08)]"
            >
              <div className="relative aspect-[3/2] w-full overflow-hidden bg-surface-container">
                {item.meta.cover && (
                  <Image
                    src={item.meta.cover}
                    alt={item.meta.title}
                    fill
                    className="object-contain transition-transform duration-700 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, 896px"
                    priority={idx === 0}
                  />
                )}
              </div>
              <div className="p-6 md:p-8">
                {item.meta.date && (
                  <p className="mb-2 text-primary font-label-md">{item.meta.date}</p>
                )}
                <h3 className="mb-3 font-display text-headline-md text-on-surface transition-colors group-hover:text-primary md:text-headline-lg">
                  {item.meta.title}
                </h3>
                {item.meta.excerpt && (
                  <p className="font-body text-body-md leading-relaxed text-on-surface-variant">
                    {item.meta.excerpt}
                  </p>
                )}
                <span className="mt-6 inline-flex items-center text-primary font-label-md">
                  {t.activities.readMore}
                  <span className="material-symbols-outlined ml-2 text-[20px] transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </span>
              </div>
            </Link>
          ))}

          {/* CTA Card */}
          <div className="bg-primary/5 rounded-lg border border-primary/20 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden md:p-12">
            <div className="absolute top-0 right-0 opacity-5 -mr-12 -mt-12">
              <span className="material-symbols-outlined text-[200px]">eco</span>
            </div>
            <h3 className="font-display text-headline-lg text-primary mb-4">
              {t.activities.ctaTitle}
            </h3>
            <p className="text-on-surface-variant font-body text-body-md max-w-lg mb-8">
              {t.activities.ctaBody}
            </p>
            <Link
              href={`/${locale}/contact`}
              className="bg-primary text-on-primary px-10 py-4 rounded-full font-label-md shadow-md hover:shadow-xl transition-all duration-300 active:scale-95"
            >
              {t.activities.ctaButton}
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
