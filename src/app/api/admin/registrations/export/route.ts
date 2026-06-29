import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { registrations } from "@/db/schema";
import { requireRegistrations } from "@/lib/admin";

const HEADERS = [
  "id",
  "created_at",
  "session_date",
  "full_name",
  "furigana",
  "email",
  "phone",
  "gender",
  "nationality",
  "prefecture",
  "referral_source",
  "photo_consent",
  "locale",
  "handled",
];

function csvCell(v: unknown): string {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET() {
  const session = await requireRegistrations();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await db
    .select()
    .from(registrations)
    .orderBy(desc(registrations.id));

  const lines = [
    HEADERS.join(","),
    ...rows.map((r) =>
      [
        r.id,
        r.createdAt instanceof Date ? r.createdAt.toISOString() : r.createdAt,
        r.sessionDate,
        r.fullName,
        r.furigana,
        r.email,
        r.phone,
        r.gender,
        r.nationality,
        r.prefecture,
        r.referralSource,
        r.photoConsent,
        r.locale,
        r.handled ? "yes" : "no",
      ]
        .map(csvCell)
        .join(","),
    ),
  ];
  const csv = "﻿" + lines.join("\n"); // BOM for Excel/Japanese

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="registrations.csv"`,
    },
  });
}
