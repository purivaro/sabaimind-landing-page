import { NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { courseDates } from "@/db/schema";
import { requireCourseDates } from "@/lib/admin";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Stable, unique token stored in registrations.session_date. */
function genValue(date: string | null): string {
  const base = date && ISO_DATE.test(date) ? date : "cohort";
  return `${base}-${Math.random().toString(36).slice(2, 7)}`;
}

export async function GET() {
  const me = await requireCourseDates();
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const rows = await db
    .select()
    .from(courseDates)
    .orderBy(asc(courseDates.sortOrder), asc(courseDates.date));
  return NextResponse.json({ courseDates: rows });
}

export async function POST(req: Request) {
  const me = await requireCourseDates();
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const d = await req.json().catch(() => null);
  if (!d) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const labelJa = String(d.labelJa ?? "").trim();
  if (!labelJa)
    return NextResponse.json({ error: "labelJa is required" }, { status: 400 });

  const date = d.date ? String(d.date).trim() : null;
  if (date && !ISO_DATE.test(date))
    return NextResponse.json(
      { error: "date must be YYYY-MM-DD" },
      { status: 400 },
    );

  const [row] = await db
    .insert(courseDates)
    .values({
      value: genValue(date),
      date,
      labelJa,
      labelEn: d.labelEn ? String(d.labelEn).trim() : null,
      sortOrder: Number.isFinite(Number(d.sortOrder))
        ? Math.trunc(Number(d.sortOrder))
        : 0,
      isActive: d.isActive === false ? false : true,
    })
    .returning();
  return NextResponse.json({ ok: true, courseDate: row }, { status: 201 });
}
