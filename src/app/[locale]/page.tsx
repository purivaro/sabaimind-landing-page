import Link from "next/link";
import Image from "next/image";
import { type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getAllContent } from "@/lib/content";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = getDictionary(locale);

  const activities = getAllContent("activities", locale).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative -mt-20 flex min-h-[88vh] items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero/sky-lantern-crowd.jpg"
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/35 to-black/50" />
          <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/20 to-transparent" />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-container-max px-margin-mobile pt-16 md:px-margin-desktop">
          <div className="max-w-2xl">
            <p className="mb-5 font-label-md uppercase tracking-[0.25em] text-primary-fixed">
              {t.home.eyebrow}
            </p>
            <h1 className="font-display text-display leading-[1.1] text-white">
              {t.home.heroHeadline}
              <span className="mt-5 block font-display text-headline-lg font-normal text-white/80">
                {t.home.heroSubhead}
              </span>
            </h1>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href={`/${locale}/about`}
                className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 font-label-md uppercase tracking-wide text-on-primary shadow-[0_10px_30px_-10px_rgb(124_87_31/0.7)] transition-all duration-200 hover:bg-primary-fixed-dim hover:text-on-primary-fixed active:translate-y-px"
              >
                {t.home.ctaPrimary}
              </Link>
              <Link
                href={`/${locale}/activities`}
                className="inline-flex items-center justify-center rounded-full border border-white/40 px-8 py-4 font-label-md uppercase tracking-wide text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white/10"
              >
                {t.home.ctaActivities}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Activities */}
      {activities.length > 0 && (
        <section className="py-20 md:py-32 japanese-motif">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
              <div>
                <h2 className="font-display text-headline-lg text-on-surface">
                  {t.home.featuredActivities}
                </h2>
                <p className="font-body text-body-md text-on-surface-variant mt-2">
                  {t.home.featuredActivitiesSub}
                </p>
              </div>
              <Link
                href={`/${locale}/activities`}
                className="font-label-md text-primary border-b border-primary/30 pb-1 hover:border-primary transition-all"
              >
                {t.home.viewAll}
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {activities.map((item, idx) => (
                <Link
                  key={item.slug}
                  href={`/${locale}/activities/${item.slug}`}
                  className={`group bg-surface-container-lowest overflow-hidden rounded-2xl border border-outline-variant/20 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover ${
                    idx > 0 ? "mt-8 md:mt-0" : ""
                  }`}
                >
                  {item.meta.cover ? (
                    <div className="aspect-4/5 overflow-hidden">
                      <Image
                        src={item.meta.cover}
                        alt={item.meta.title}
                        width={600}
                        height={750}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="aspect-4/5 bg-secondary-fixed/30 flex items-center justify-center">
                      <span className="material-symbols-outlined text-secondary text-6xl">
                        spa
                      </span>
                    </div>
                  )}
                  <div className="p-8">
                    {item.meta.date && (
                      <span className="text-[10px] uppercase tracking-widest text-secondary font-semibold mb-3 block">
                        {item.meta.date}
                      </span>
                    )}
                    <h3 className="font-display text-headline-md mb-4 text-on-surface">
                      {item.meta.title}
                    </h3>
                    {item.meta.excerpt && (
                      <p className="font-body text-body-md text-on-surface-variant line-clamp-2">
                        {item.meta.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Video Highlight */}
      <section className="py-20 md:py-32">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <Link
            href={`/${locale}/videos`}
            className="relative block group cursor-pointer overflow-hidden rounded-2xl shadow-editorial"
          >
            <div className="relative w-full aspect-video">
              <Image
                src="/images/hero/pool-reflection.jpg"
                alt={t.home.videoTitle}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                sizes="(max-width: 1120px) 100vw, 1120px"
              />
            </div>
            <div className="absolute inset-0 bg-on-surface/20 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border border-surface/50 backdrop-blur-sm flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:bg-primary/20">
                <span className="material-symbols-outlined text-white text-5xl translate-x-1">
                  play_arrow
                </span>
              </div>
            </div>
            <div className="absolute bottom-6 left-6 right-6 md:bottom-12 md:left-12 md:right-12">
              <h3 className="font-display text-2xl md:text-headline-lg text-white mb-2">
                {t.home.videoTitle}
              </h3>
              <p className="font-body text-body-md text-white/80">
                {t.home.videoSub}
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-32 bg-secondary-fixed/30 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none japanese-motif" />
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center relative z-10">
          <h2 className="font-display text-4xl md:text-display text-secondary mb-8">
            {t.home.ctaSectionTitle}
          </h2>
          <p className="font-body text-body-lg text-on-secondary-fixed-variant max-w-2xl mx-auto mb-12">
            {t.home.ctaSectionBody}
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <Link
              href={`/${locale}/contact`}
              className="rounded-full bg-primary text-on-primary px-12 py-5 font-label-md hover:bg-primary-fixed-dim hover:text-on-primary-fixed transition-all duration-200 active:translate-y-px uppercase tracking-widest shadow-[0_10px_30px_-10px_rgb(124_87_31/0.6)]"
            >
              {t.home.ctaContact}
            </Link>
            <Link
              href={`/${locale}/activities`}
              className="rounded-full border border-secondary text-secondary px-12 py-5 font-label-md hover:bg-secondary hover:text-on-secondary transition-all duration-200 uppercase tracking-widest"
            >
              {t.home.ctaActivities}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
