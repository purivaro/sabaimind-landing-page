import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { courseDates } from "@/db/schema";
import { requireCourseDates } from "@/lib/admin";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const me = await requireCourseDates();
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const d = await req.json().catch(() => null);
  if (!d) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const set: Record<string, unknown> = { updatedAt: new Date() };
  if (d.labelJa !== undefined) {
    const v = String(d.labelJa).trim();
    if (!v)
      return NextResponse.json(
        { error: "labelJa cannot be empty" },
        { status: 400 },
      );
    set.labelJa = v;
  }
  if (d.labelEn !== undefined)
    set.labelEn = d.labelEn ? String(d.labelEn).trim() : null;
  if (d.date !== undefined) {
    const date = d.date ? String(d.date).trim() : null;
    if (date && !ISO_DATE.test(date))
      return NextResponse.json(
        { error: "date must be YYYY-MM-DD" },
        { status: 400 },
      );
    set.date = date;
  }
  if (d.sortOrder !== undefined) set.sortOrder = Math.trunc(Number(d.sortOrder) || 0);
  if (d.isActive !== undefined) set.isActive = !!d.isActive;

  await db.update(courseDates).set(set).where(eq(courseDates.id, Number(id)));
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const me = await requireCourseDates();
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await db.delete(courseDates).where(eq(courseDates.id, Number(id)));
  return NextResponse.json({ ok: true });
}
