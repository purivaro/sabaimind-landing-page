import { NextResponse } from "next/server";
import OpenAI from "openai";
import { put } from "@vercel/blob";
import { requireAdmin } from "@/lib/admin";

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { prompt } = await req.json();
  if (!prompt?.trim()) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  try {
    const openai = new OpenAI(); // reads OPENAI_API_KEY
    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1536x1024",
    });
    const b64 = result.data?.[0]?.b64_json;
    if (!b64) {
      return NextResponse.json({ error: "No image returned" }, { status: 502 });
    }
    const buffer = Buffer.from(b64, "base64");
    const key = `blog/ai-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.png`;
    const blob = await put(key, buffer, {
      access: "public",
      contentType: "image/png",
    });
    return NextResponse.json({ ok: true, url: blob.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Image generation failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
