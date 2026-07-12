import type { Metadata } from "next";
import { type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getContent } from "@/lib/content";
import { getUpcomingCohorts, cohortLabel } from "@/lib/courseDates";
import { RegistrationForm } from "@/components/RegistrationForm";

export const dynamic = "force-dynamic"; // available dates depend on the current date

const SITE_URL = "https://sabaimind.or.jp";

const registerSeo: Record<Locale, { title: string; description: string }> = {
  ja: {
    title: "宇都宮の初心者向け瞑想会 申込み",
    description:
      "宇都宮 大谷町で開催する初心者向け瞑想会のお申し込みページです。午後・夜の回から選べ、初めての方も1回から参加できます。",
  },
  en: {
    title: "Register for Beginner Meditation in Utsunomiya | Sabai Mind NPO",
    description:
      "Register for beginner-friendly meditation sessions in Oya, Utsunomiya. Choose afternoon or evening sessions and join from a single session.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = registerSeo[locale];
  const url = `${SITE_URL}/${locale}/register`;

  return {
    metadataBase: new URL(SITE_URL),
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: url,
      languages: {
        ja: `${SITE_URL}/ja/register`,
        en: `${SITE_URL}/en/register`,
        "x-default": `${SITE_URL}/ja/register`,
      },
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url,
      siteName: "NPO法人サバイマインド",
    },
    twitter: {
      title: seo.title,
      description: seo.description,
    },
  };
}

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const course = getContent("activities", "utsunomiya-meditation-course", locale);
  const sessions = (await getUpcomingCohorts()).map((c) => ({
    value: c.value,
    label: cohortLabel(c, locale),
  }));

  return (
    <div className="mx-auto max-w-2xl px-margin-mobile py-20 md:py-28">
      <header className="mb-10 text-center">
        <h1 className="font-display text-display text-on-surface">
          {t.register.title}
        </h1>
        <p className="mt-3 font-body text-body-lg text-on-surface-variant">
          {t.register.subtitle}
        </p>
        {course && (
          <p className="mt-5 inline-block rounded-full bg-secondary-fixed/40 px-5 py-2 font-body text-body-md text-on-surface">
            {t.register.courseLabel}：{course.meta.title}
          </p>
        )}
      </header>

      {sessions.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-outline-variant/50 p-10 text-center font-body text-body-md text-on-surface-variant">
          {t.register.noSessions}
        </p>
      ) : (
        <RegistrationForm
          locale={locale}
          sessions={sessions}
          labels={t.register}
          homeHref={`/${locale}`}
        />
      )}
    </div>
  );
}
