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
  const news = getAllContent("news", locale).slice(0, 3);
  const featured = news[0];
  const side = news.slice(1, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero/sky-lantern-crowd.jpg"
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />
        </div>
        <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full">
          <div className="max-w-2xl">
            <p className="font-label-md text-primary mb-4 tracking-[0.2em] uppercase">
              {t.home.eyebrow}
            </p>
            <h1 className="font-display text-5xl md:text-display mb-6 leading-tight text-on-surface">
              {t.home.heroHeadline}
              <span className="font-display text-headline-lg block mt-4 font-normal text-on-surface-variant">
                {t.home.heroSubhead}
              </span>
            </h1>
            <Link
              href={`/${locale}/about`}
              className="inline-block bg-primary text-on-primary px-8 py-4 font-label-md uppercase tracking-wide hover:bg-primary-fixed-dim transition-colors duration-300"
            >
              {t.home.ctaPrimary}
            </Link>
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
                  className={`group bg-surface-container-lowest overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/20 ${
                    idx > 0 ? "mt-8 md:mt-0" : ""
                  }`}
                >
                  {item.meta.cover ? (
                    <div className="aspect-[4/5] overflow-hidden">
                      <Image
                        src={item.meta.cover}
                        alt={item.meta.title}
                        width={600}
                        height={750}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[4/5] bg-secondary-fixed/30 flex items-center justify-center">
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

      {/* Latest Updates — Bento */}
      {featured && (
        <section className="py-20 md:py-32 bg-surface-container-low">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <h2 className="font-display text-headline-lg text-on-surface mb-16 text-center">
              {t.home.latestUpdates}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
              <Link
                href={`/${locale}/news/${featured.slug}`}
                className="md:col-span-8 bg-surface-container-lowest p-10 border border-outline-variant/10 flex flex-col justify-between group"
              >
                <div>
                  {featured.meta.date && (
                    <span className="text-label-md text-secondary mb-4 block uppercase tracking-widest">
                      NEWS — {featured.meta.date}
                    </span>
                  )}
                  <h3 className="font-display text-headline-lg mb-6 leading-snug text-on-surface group-hover:text-primary transition-colors">
                    {featured.meta.title}
                  </h3>
                  {featured.meta.excerpt && (
                    <p className="font-body text-body-lg text-on-surface-variant mb-8">
                      {featured.meta.excerpt}
                    </p>
                  )}
                </div>
                <span className="inline-flex items-center gap-2 font-label-md text-primary uppercase tracking-wider">
                  {t.home.readFullStory}
                  <span className="material-symbols-outlined transition-transform group-hover:translate-x-1 text-[18px]">
                    arrow_forward
                  </span>
                </span>
              </Link>
              <div className="md:col-span-4 flex flex-col gap-gutter">
                {side.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/${locale}/news/${item.slug}`}
                    className="bg-surface-container-lowest p-8 border border-outline-variant/10 hover:border-primary/30 transition-colors flex-1 flex flex-col justify-between group"
                  >
                    <div>
                      {item.meta.date && (
                        <span className="text-label-md text-secondary mb-3 block uppercase tracking-widest">
                          {item.meta.date}
                        </span>
                      )}
                      <h4 className="font-display text-headline-md mb-4 text-on-surface group-hover:text-primary transition-colors">
                        {item.meta.title}
                      </h4>
                    </div>
                    <span className="text-label-md text-primary uppercase font-bold tracking-wider">
                      {t.home.readFullStory}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Video Highlight */}
      <section className="py-20 md:py-32">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <Link
            href={`/${locale}/videos`}
            className="relative block group cursor-pointer overflow-hidden shadow-2xl"
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
              className="bg-primary text-on-primary px-12 py-5 font-label-md hover:opacity-90 transition-all uppercase tracking-widest"
            >
              {t.home.ctaContact}
            </Link>
            <Link
              href={`/${locale}/activities`}
              className="border border-secondary text-secondary px-12 py-5 font-label-md hover:bg-secondary hover:text-on-secondary transition-all uppercase tracking-widest"
            >
              {t.home.ctaActivities}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
