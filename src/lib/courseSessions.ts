import type { Locale } from "@/i18n/config";

export type CourseSession = {
  /** ISO date (Asia/Tokyo) of the session, used for value + past-filtering. */
  date: string;
  labelJa: string;
  labelEn: string;
  /** Time slot(s) offered that day. */
  slotsJa: string;
  slotsEn: string;
};

const EVE_JA = "19:30〜21:00";
const EVE_EN = "19:30–21:00";
const BOTH_JA = "14:30〜16:00 / 19:30〜21:00";
const BOTH_EN = "14:30–16:00 / 19:30–21:00";

/** The 8-session 2026 schedule for the Utsunomiya meditation course. */
export const COURSE_SESSIONS: CourseSession[] = [
  { date: "2026-05-26", labelJa: "5月26日（火）", labelEn: "Tue, May 26", slotsJa: EVE_JA, slotsEn: EVE_EN },
  { date: "2026-06-09", labelJa: "6月9日（火）", labelEn: "Tue, Jun 9", slotsJa: EVE_JA, slotsEn: EVE_EN },
  { date: "2026-06-16", labelJa: "6月16日（火）", labelEn: "Tue, Jun 16", slotsJa: EVE_JA, slotsEn: EVE_EN },
  { date: "2026-06-23", labelJa: "6月23日（火）", labelEn: "Tue, Jun 23", slotsJa: EVE_JA, slotsEn: EVE_EN },
  { date: "2026-07-07", labelJa: "7月7日（火）", labelEn: "Tue, Jul 7", slotsJa: BOTH_JA, slotsEn: BOTH_EN },
  { date: "2026-07-21", labelJa: "7月21日（火）", labelEn: "Tue, Jul 21", slotsJa: BOTH_JA, slotsEn: BOTH_EN },
  { date: "2026-07-28", labelJa: "7月28日（火）", labelEn: "Tue, Jul 28", slotsJa: BOTH_JA, slotsEn: BOTH_EN },
  { date: "2026-08-04", labelJa: "8月4日（火）", labelEn: "Tue, Aug 4", slotsJa: BOTH_JA, slotsEn: BOTH_EN },
];

/** Today's date as YYYY-MM-DD in Asia/Tokyo (the venue's timezone). */
export function todayInTokyo(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** Sessions whose date is today or later (past dates auto-hidden). */
export function getUpcomingSessions(now: Date = new Date()): CourseSession[] {
  const today = todayInTokyo(now);
  return COURSE_SESSIONS.filter((s) => s.date >= today);
}

/** Human-readable option label, e.g. "7月7日（火） 14:30〜16:00 / 19:30〜21:00". */
export function sessionLabel(s: CourseSession, locale: Locale): string {
  return locale === "en"
    ? `${s.labelEn} · ${s.slotsEn}`
    : `${s.labelJa} ${s.slotsJa}`;
}
