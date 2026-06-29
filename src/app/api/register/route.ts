import { NextResponse } from "next/server";
import { db } from "@/db";
import { registrations } from "@/db/schema";
import { getContent } from "@/lib/content";
import {
  COURSE_SESSIONS,
  getUpcomingSessions,
  sessionLabel,
} from "@/lib/courseSessions";
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

  const missing = REQUIRED.filter((k) => !get(k));
  if (missing.length) {
    return NextResponse.json(
      { error: "Missing required fields", fields: missing },
      { status: 422 },
    );
  }

  const sessionDate = get("sessionDate");
  // Must be a real, not-yet-passed session.
  if (!getUpcomingSessions().some((s) => s.date === sessionDate)) {
    return NextResponse.json(
      { error: "Selected date is not available" },
      { status: 422 },
    );
  }

  const locale: Locale = get("locale") === "en" ? "en" : "ja";

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
  const session = COURSE_SESSIONS.find((s) => s.date === sessionDate);
  const course = getContent("activities", COURSE_SLUG, locale);
  const email = await sendRegistrationEmails({
    email: get("email"),
    fullName: get("fullName"),
    furigana: get("furigana"),
    gender: get("gender"),
    nationality: get("nationality"),
    prefecture: get("prefecture") || null,
    phone: get("phone") || null,
    referralSource: get("referralSource"),
    photoConsent: get("photoConsent"),
    sessionLabel: session ? sessionLabel(session, locale) : sessionDate,
    courseTitle: course?.meta.title ?? "Meditation Course",
  }).catch(() => ({ customer: false, team: false }));

  return NextResponse.json({ ok: true, email });
}
