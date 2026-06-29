import "server-only";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { courseDates } from "@/db/schema";
import type { CourseDate } from "@/db/schema";
import type { Locale } from "@/i18n/config";

export type { CourseDate };

/** Today's date as YYYY-MM-DD in Asia/Tokyo (the venue's timezone). */
export function todayInTokyo(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** Label for a cohort in the given locale (falls back to JA). */
export function cohortLabel(c: CourseDate, locale: Locale): string {
  return locale === "en" ? c.labelEn || c.labelJa : c.labelJa;
}

/** All cohorts, ordered by sort_order then date (admin view). */
export async function getAllCohorts(): Promise<CourseDate[]> {
  return db
    .select()
    .from(courseDates)
    .orderBy(asc(courseDates.sortOrder), asc(courseDates.date));
}

/**
 * Cohorts shown on the public form: active, and either undated or dated today
 * or later (past dates auto-hidden).
 */
export async function getUpcomingCohorts(
  now: Date = new Date(),
): Promise<CourseDate[]> {
  const today = todayInTokyo(now);
  const rows = await db
    .select()
    .from(courseDates)
    .where(eq(courseDates.isActive, true))
    .orderBy(asc(courseDates.sortOrder), asc(courseDates.date));
  return rows.filter((c) => !c.date || c.date >= today);
}

/** Find a cohort by its stored value. */
export async function findCohort(
  value: string,
): Promise<CourseDate | undefined> {
  const rows = await db
    .select()
    .from(courseDates)
    .where(eq(courseDates.value, value))
    .limit(1);
  return rows[0];
}
