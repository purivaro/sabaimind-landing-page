import type { Locale } from "@/i18n/config";

export type SlotKey = "afternoon" | "evening";

const SLOT = {
  afternoon: { ja: "午後", en: "Afternoon", timeJa: "14:30〜16:00", timeEn: "14:30–16:00" },
  evening: { ja: "夜", en: "Evening", timeJa: "19:30〜21:00", timeEn: "19:30–21:00" },
} as const;

type CourseDate = {
  date: string; // ISO date (Asia/Tokyo)
  labelJa: string;
  labelEn: string;
  slots: SlotKey[];
};

/** The 2026 schedule. Sessions 1–4 evening only; 5–8 add an afternoon slot. */
const COURSE_DATES: CourseDate[] = [
  { date: "2026-05-26", labelJa: "5月26日（火）", labelEn: "Tue, May 26", slots: ["evening"] },
  { date: "2026-06-09", labelJa: "6月9日（火）", labelEn: "Tue, Jun 9", slots: ["evening"] },
  { date: "2026-06-16", labelJa: "6月16日（火）", labelEn: "Tue, Jun 16", slots: ["evening"] },
  { date: "2026-06-23", labelJa: "6月23日（火）", labelEn: "Tue, Jun 23", slots: ["evening"] },
  { date: "2026-07-07", labelJa: "7月7日（火）", labelEn: "Tue, Jul 7", slots: ["afternoon", "evening"] },
  { date: "2026-07-21", labelJa: "7月21日（火）", labelEn: "Tue, Jul 21", slots: ["afternoon", "evening"] },
  { date: "2026-07-28", labelJa: "7月28日（火）", labelEn: "Tue, Jul 28", slots: ["afternoon", "evening"] },
  { date: "2026-08-04", labelJa: "8月4日（火）", labelEn: "Tue, Aug 4", slots: ["afternoon", "evening"] },
];

/** One selectable cohort = a single (date × time-slot). */
export type CourseSession = {
  value: string; // `${date}#${slot}` — stored in registrations.session_date
  date: string;
  slot: SlotKey;
  labelJa: string;
  labelEn: string;
};

/** All cohorts (afternoon and evening split into separate options). */
export const ALL_SESSIONS: CourseSession[] = COURSE_DATES.flatMap((d) =>
  d.slots.map((slot) => ({
    value: `${d.date}#${slot}`,
    date: d.date,
    slot,
    labelJa: `${d.labelJa} ${SLOT[slot].ja} ${SLOT[slot].timeJa}`,
    labelEn: `${d.labelEn} · ${SLOT[slot].en} ${SLOT[slot].timeEn}`,
  })),
);

/** Today's date as YYYY-MM-DD in Asia/Tokyo (the venue's timezone). */
export function todayInTokyo(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** Cohorts whose date is today or later (past dates auto-hidden). */
export function getUpcomingSessions(now: Date = new Date()): CourseSession[] {
  const today = todayInTokyo(now);
  return ALL_SESSIONS.filter((s) => s.date >= today);
}

/** Find a cohort by its stored value. */
export function findSession(value: string): CourseSession | undefined {
  return ALL_SESSIONS.find((s) => s.value === value);
}

export function sessionLabel(s: CourseSession, locale: Locale): string {
  return locale === "en" ? s.labelEn : s.labelJa;
}
