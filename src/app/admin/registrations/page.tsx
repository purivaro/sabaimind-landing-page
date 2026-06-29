import Link from "next/link";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { registrations } from "@/db/schema";
import { COURSE_SESSIONS, sessionLabel } from "@/lib/courseSessions";
import { RegistrationActions } from "@/components/admin/RegistrationActions";

export const dynamic = "force-dynamic";

function dateLabel(iso: string): string {
  const s = COURSE_SESSIONS.find((x) => x.date === iso);
  return s ? sessionLabel(s, "ja") : iso;
}

function fmt(d: Date): string {
  return new Date(d).toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
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

  const rows = await db
    .select()
    .from(registrations)
    .where(
      sessionFilter === "all"
        ? undefined
        : and(eq(registrations.sessionDate, sessionFilter)),
    )
    .orderBy(desc(registrations.id));

  const filters = [
    { key: "all", label: "すべて" },
    ...COURSE_SESSIONS.map((s) => ({ key: s.date, label: dateLabel(s.date) })),
  ];

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-on-surface">
          お申し込み一覧{" "}
          <span className="text-base font-normal text-on-surface-variant">
            （{rows.length}）
          </span>
        </h1>
        <a
          href="/api/admin/registrations/export"
          className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant/50 px-4 py-1.5 text-sm font-medium text-on-surface hover:bg-surface-container"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          CSV
        </a>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
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

      {rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-outline-variant/50 p-12 text-center text-on-surface-variant">
          お申し込みはまだありません。
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-outline-variant/30 bg-surface-container-lowest">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-outline-variant/30 text-on-surface-variant">
              <tr>
                <th className="px-3 py-3 font-medium">申込日時</th>
                <th className="px-3 py-3 font-medium">開催日</th>
                <th className="px-3 py-3 font-medium">氏名</th>
                <th className="px-3 py-3 font-medium">連絡先</th>
                <th className="px-3 py-3 font-medium">属性</th>
                <th className="px-3 py-3 font-medium">きっかけ</th>
                <th className="px-3 py-3 font-medium">写真</th>
                <th className="px-3 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-outline-variant/20 align-top last:border-0"
                >
                  <td className="whitespace-nowrap px-3 py-3 text-on-surface-variant">
                    {fmt(r.createdAt)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-on-surface">
                    {dateLabel(r.sessionDate)}
                  </td>
                  <td className="px-3 py-3">
                    <div className="font-medium text-on-surface">{r.fullName}</div>
                    <div className="text-xs text-on-surface-variant">{r.furigana}</div>
                  </td>
                  <td className="px-3 py-3">
                    <a href={`mailto:${r.email}`} className="text-primary hover:underline">
                      {r.email}
                    </a>
                    <div className="text-xs text-on-surface-variant">{r.phone || "—"}</div>
                  </td>
                  <td className="px-3 py-3 text-on-surface-variant">
                    {r.gender} / {r.nationality}
                    {r.prefecture ? ` / ${r.prefecture}` : ""}
                  </td>
                  <td className="px-3 py-3 text-on-surface-variant">{r.referralSource}</td>
                  <td className="px-3 py-3 text-on-surface-variant">{r.photoConsent}</td>
                  <td className="px-3 py-3">
                    <RegistrationActions id={r.id} handled={r.handled} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
