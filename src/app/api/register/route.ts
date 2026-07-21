import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { registrations, users } from "@/db/schema";
import { getContent } from "@/lib/content";
import {
  findCohort,
  getUpcomingCohorts,
  cohortLabel,
} from "@/lib/courseDates";
import { sendRegistrationEmails } from "@/lib/email";
import type { Locale } from "@/i18n/config";

const COURSE_SLUG = "utsunomiya-meditation-course";
const REQUIRED = [
  "email",
  "fullName",
  "furigana",
  "gender",
  "nationality",
  "sessionDate",
  "referralSource",
  "photoConsent",
] as const;

export async function POST(req: Request) {
  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const get = (k: string) =>
    typeof data[k] === "string" ? (data[k] as string).trim() : "";

  const locale: Locale = get("locale") === "en" ? "en" : "ja";
  const requiredFields = locale === "ja" ? [...REQUIRED, "phone"] : REQUIRED;
  const missing = requiredFields.filter((k) => !get(k));
  if (missing.length) {
    return NextResponse.json(
      { error: "Missing required fields", fields: missing },
      { status: 422 },
    );
  }

  const sessionDate = get("sessionDate");
  // Must be a real, active, not-yet-passed cohort.
  const cohorts = await getUpcomingCohorts();
  if (!cohorts.some((c) => c.value === sessionDate)) {
    return NextResponse.json(
      { error: "Selected date is not available" },
      { status: 422 },
    );
  }

  try {
    await db.insert(registrations).values({
      courseSlug: COURSE_SLUG,
      sessionDate,
      email: get("email"),
      fullName: get("fullName"),
      furigana: get("furigana"),
      gender: get("gender"),
      nationality: get("nationality"),
      prefecture: get("prefecture") || null,
      phone: get("phone") || null,
      referralSource: get("referralSource"),
      photoConsent: get("photoConsent"),
      locale,
    });
  } catch {
    return NextResponse.json({ error: "Could not save registration" }, { status: 500 });
  }

  // Email is best-effort — never block a successful registration.
  const cohort = cohorts.find((c) => c.value === sessionDate) ?? (await findCohort(sessionDate));
  const course = getContent("activities", COURSE_SLUG, locale);

  // Team recipients: anyone toggled "notify on registration" in the Users page.
  const notifyTeam = await db
    .select({ email: users.email })
    .from(users)
    .where(and(eq(users.isActive, true), eq(users.notifyRegistrations, true)))
    .catch(() => [] as { email: string }[]);

  const email = await sendRegistrationEmails(
    {
      email: get("email"),
      fullName: get("fullName"),
      furigana: get("furigana"),
      gender: get("gender"),
      nationality: get("nationality"),
      prefecture: get("prefecture") || null,
      phone: get("phone") || null,
      referralSource: get("referralSource"),
      photoConsent: get("photoConsent"),
      sessionLabel: cohort ? cohortLabel(cohort, locale) : sessionDate,
      courseTitle: course?.meta.title ?? "Meditation Course",
    },
    notifyTeam.map((u) => u.email),
  ).catch(() => ({ customer: false, team: false }));

  return NextResponse.json({ ok: true, email });
}
