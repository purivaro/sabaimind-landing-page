import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getContent } from "@/lib/content";
import { VideoHighlight } from "@/components/VideoHighlight";

const SITE_URL = "https://sabaimind.or.jp";

const homeSeo: Record<Locale, { title: string; description: string }> = {
  ja: {
    title:
      "栃木・宇都宮の瞑想｜初心者向け瞑想体験｜NPO法人サバーイマインド",
    description:
      "栃木・宇都宮で初心者向けの瞑想を体験しませんか。仕事や日常で疲れた心を休める、やさしい瞑想の時間をご案内しています。",
  },
  en: {
    title:
      "Meditation in Utsunomiya, Tochigi | Beginner-Friendly Mindfulness | Sabai Mind NPO",
    description:
      "Sabai Mind NPO offers beginner-friendly Japanese meditation and mindfulness activities in Utsunomiya and Tochigi for people seeking rest, calm, and a gentle reset.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = homeSeo[locale];
  const url = `${SITE_URL}/${locale}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: url,
      languages: {
        ja: `${SITE_URL}/ja`,
        en: `${SITE_URL}/en`,
        "x-default": `${SITE_URL}/ja`,
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

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = getDictionary(locale);

  const course = getContent("activities", "utsunomiya-meditation-course", locale);
  const programImages = [
    "/images/home/activity-workshop.jpg",
    "/images/home/activity-pro.jpg",
    "/images/home/activity-songkran.jpg",
  ];

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
          {/* Background video (muted, looping) over the poster image */}
          <div className="absolute inset-0 overflow-hidden">
            <iframe
              title="Sabai Mind"
              src="https://www.youtube.com/embed/mxboCyuIY18?autoplay=1&mute=1&controls=0&loop=1&playlist=mxboCyuIY18&playsinline=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&fs=0"
              allow="autoplay; encrypted-media; picture-in-picture"
              className="pointer-events-none absolute left-1/2 top-1/2 h-[max(100vh,56.25vw)] w-[max(100vw,177.78vh)] -translate-x-1/2 -translate-y-1/2"
            />
          </div>
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
              <span className="mt-5 block whitespace-pre-line font-display text-headline-lg font-normal text-white/80">
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

      {/* Featured course promo */}
      {course && (
        <section className="bg-secondary-fixed/40 py-16 md:py-24">
          <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <Link
                href={`/${locale}/activities/utsunomiya-meditation-course`}
                className="group relative block aspect-4/3 overflow-hidden rounded-2xl shadow-editorial"
              >
                <Image
                  src="/images/activities/oneday/oneday_9.jpg"
                  alt={course.meta.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 560px"
                />
              </Link>
              <div>
                <p className="mb-4 font-label-md uppercase tracking-[0.2em] text-primary">
                  {t.home.featuredCourseEyebrow}
                </p>
                <h2 className="mb-5 font-display text-headline-lg leading-snug text-on-surface">
                  {course.meta.title}
                </h2>
                {course.meta.excerpt && (
                  <p className="mb-6 font-body text-body-lg text-on-surface-variant">
                    {course.meta.excerpt}
                  </p>
                )}
                <ul className="mb-8 space-y-3">
                  {t.home.featuredCourseHighlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-3 font-body text-body-md text-on-surface"
                    >
                      <span className="material-symbols-outlined mt-0.5 text-[20px] text-primary">
                        check_circle
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/${locale}/activities/utsunomiya-meditation-course`}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-label-md uppercase tracking-wide text-on-primary shadow-[0_10px_30px_-10px_rgb(124_87_31/0.6)] transition-all duration-200 hover:bg-primary-fixed-dim hover:text-on-primary-fixed active:translate-y-px"
                >
                  {t.home.featuredCourseCta}
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Programs */}
      <section className="border-y border-outline-variant/20 bg-surface py-20 md:py-32">
        <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <p className="mb-4 font-label-md uppercase tracking-[0.22em] text-primary">
              Sabai Mind
            </p>
            <h2 className="mb-5 font-display text-4xl leading-tight text-on-surface md:text-display">
              {t.about.sectionPrograms}
            </h2>
            <p className="font-body text-body-lg leading-relaxed text-on-surface-variant">
              {t.about.sectionProgramsSub}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-gutter md:grid-cols-3">
            {t.about.programs.map((p, idx) => (
              <article
                key={p.title}
                className="group overflow-hidden rounded-lg border border-outline-variant/20 bg-surface-container-lowest shadow-[0_12px_32px_rgba(124,87,31,0.08)] transition-shadow hover:shadow-[0_18px_42px_rgba(124,87,31,0.14)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-surface-container">
                  <Image
                    src={programImages[idx]}
                    alt={p.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-on-primary shadow-lg">
                    <span className="font-label-md">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>
                <div className="p-7 md:p-8">
                  <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-secondary-fixed/50 text-secondary">
                    <span className="material-symbols-outlined text-[30px]">
                      {p.icon}
                    </span>
                  </div>
                  <h3 className="mb-4 font-display text-headline-md leading-snug text-on-surface">
                    {p.title}
                  </h3>
                  <p className="font-body text-body-md leading-relaxed text-on-surface-variant">
                    {p.body}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="mx-auto mt-12 max-w-3xl border-t border-outline-variant/30 pt-10 text-center">
            <p className="mx-auto mb-7 max-w-2xl font-body text-body-lg leading-relaxed text-on-surface-variant">
              {t.home.programsContactBody}
            </p>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-10 py-4 font-label-md uppercase tracking-wide text-on-primary shadow-[0_10px_30px_-10px_rgb(124_87_31/0.6)] transition-all duration-200 hover:bg-primary-fixed-dim hover:text-on-primary-fixed active:translate-y-px"
            >
              <span className="material-symbols-outlined text-[20px]">
                mail
              </span>
              {t.home.ctaContact}
            </Link>
          </div>
        </div>
      </section>

      {/* Video Highlight */}
      <section className="py-20 md:py-32">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <VideoHighlight
            videoId="k5kRCRzlck8"
            title={t.home.videoTitle}
            sub={t.home.videoSub}
          />
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
