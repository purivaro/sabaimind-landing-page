import Link from "next/link";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { registrations } from "@/db/schema";
import { getAllCohorts, cohortLabel } from "@/lib/courseDates";
import { RegistrationsBoard, type RegRow } from "@/components/admin/RegistrationsBoard";
import { getAdminLang } from "@/lib/adminLang";
import { makeT } from "@/lib/adminI18n";

export const dynamic = "force-dynamic";

function fmt(d: Date): string {
  return new Date(d).toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminRegistrationsList({
  searchParams,
}: {
  searchParams: Promise<{ session?: string }>;
}) {
  const sp = await searchParams;
  const sessionFilter = sp.session ?? "all";
  const lang = await getAdminLang();
  const t = makeT(lang);
  const cl = lang === "en" ? "en" : "ja";

  const [rows, cohorts, totals] = await Promise.all([
    db
      .select()
      .from(registrations)
      .where(
        sessionFilter === "all"
          ? undefined
          : and(eq(registrations.sessionDate, sessionFilter)),
      )
      .orderBy(desc(registrations.id)),
    getAllCohorts(),
    db.select().from(registrations),
  ]);

  const labelByValue = new Map(cohorts.map((c) => [c.value, cohortLabel(c, cl)]));
  const dateLabel = (value: string) => labelByValue.get(value) ?? value;

  const handledCount = totals.filter((r) => r.handled).length;
  const summary = [
    { key: "reg.sum.total", value: totals.length, accent: "text-on-surface" },
    {
      key: "reg.sum.pending",
      value: totals.length - handledCount,
      accent: "text-primary",
    },
    { key: "reg.sum.handled", value: handledCount, accent: "text-secondary" },
  ];

  const boardRows: RegRow[] = rows.map((r) => ({
    id: r.id,
    appliedAt: fmt(r.createdAt),
    sessionLabel: dateLabel(r.sessionDate),
    email: r.email,
    fullName: r.fullName,
    furigana: r.furigana,
    gender: r.gender,
    nationality: r.nationality,
    prefecture: r.prefecture,
    phone: r.phone,
    referralSource: r.referralSource,
    photoConsent: r.photoConsent,
    handled: r.handled,
  }));

  const filters = [
    { key: "all", label: t("reg.all") },
    ...cohorts.map((c) => ({ key: c.value, label: cohortLabel(c, cl) })),
  ];

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      {/* Summary cards */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        {summary.map((s) => (
          <div
            key={s.key}
            className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-4 py-4"
          >
            <span className="block text-xs text-on-surface-variant">
              {t(s.key)}
            </span>
            <strong className={`mt-1 block text-2xl font-bold ${s.accent}`}>
              {s.value}
            </strong>
          </div>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <Link
              key={f.key}
              href={f.key === "all" ? "/admin/registrations" : `/admin/registrations?session=${f.key}`}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                sessionFilter === f.key
                  ? "bg-primary text-on-primary"
                  : "border border-outline-variant/50 text-on-surface hover:bg-surface-container"
              }`}
            >
              {f.label}
            </Link>
          ))}
        </div>
        <a
          href="/api/admin/registrations/export"
          className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant/50 px-4 py-1.5 text-sm font-medium text-on-surface hover:bg-surface-container"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          {t("reg.csv")}
        </a>
      </div>

      <RegistrationsBoard rows={boardRows} lang={lang} />
    </main>
  );
}
