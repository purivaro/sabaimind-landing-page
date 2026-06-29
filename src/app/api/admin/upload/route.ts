import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireBlog } from "@/lib/admin";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/gif"];

export async function POST(req: Request) {
  const session = await requireBlog();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: "Unsupported image type" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image too large (max 8MB)" }, { status: 400 });
  }

  const ext = file.type.split("/")[1].replace("jpeg", "jpg");
  const key = `blog/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const blob = await put(key, file, {
    access: "public",
    contentType: file.type,
  });

  return NextResponse.json({ ok: true, url: blob.url });
}
