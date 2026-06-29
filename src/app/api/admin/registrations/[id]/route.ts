import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { registrations } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { handled } = await req.json();
  await db
    .update(registrations)
    .set({ handled: !!handled })
    .where(eq(registrations.id, Number(id)));
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await db.delete(registrations).where(eq(registrations.id, Number(id)));
  return NextResponse.json({ ok: true });
}
