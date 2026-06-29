import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { requireBlog } from "@/lib/admin";

const SYSTEM = `You write blog articles for NPO法人 Sabai Mind, a Japanese non-profit that brings Thai-style mindfulness and meditation to Japan and runs Thai cultural events (Songkran, Sky Lantern festivals).
Voice: calm, warm, trustworthy, never salesy.
Return ONLY a JSON object — no markdown fences, no commentary — with exactly these keys:
- "title": a concise, compelling headline
- "excerpt": one or two sentences summarizing the article
- "body": the full article in Markdown (use ## headings, short paragraphs)`;

function parseJson(text: string): { title: string; excerpt: string; body: string } {
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");
  return JSON.parse(cleaned);
}

export async function POST(req: Request) {
  const session = await requireBlog();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { idea, instruction, locale } = await req.json();
  if (!idea?.trim()) {
    return NextResponse.json({ error: "Idea is required" }, { status: 400 });
  }
  const language = locale === "en" ? "English" : "Japanese";

  try {
    const client = new Anthropic(); // reads ANTHROPIC_API_KEY
    const msg = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 8000,
      system: SYSTEM,
      messages: [
        {
          role: "user",
          content: `Write the article in ${language}.\n\nIdea: ${idea}\n${
            instruction ? `\nAdditional guidance: ${instruction}` : ""
          }`,
        },
      ],
    });
    const text = msg.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { text: string }).text)
      .join("");
    const data = parseJson(text);
    return NextResponse.json({ ok: true, ...data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI draft failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
