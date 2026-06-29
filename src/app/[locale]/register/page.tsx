import { type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getContent } from "@/lib/content";
import { getUpcomingCohorts, cohortLabel } from "@/lib/courseDates";
import { RegistrationForm } from "@/components/RegistrationForm";

export const dynamic = "force-dynamic"; // available dates depend on the current date

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
