import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Locale } from "@/i18n/config";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type ContentMeta = {
  title: string;
  date?: string;
  cover?: string;
  gallery?: string[];
  excerpt?: string;
  published?: boolean;
  locale?: Locale;
  youtube?: string;
  [key: string]: unknown;
};

export type ContentItem = {
  slug: string;
  meta: ContentMeta;
  body: string;
};

function normalizeMeta(data: Record<string, unknown>): ContentMeta {
  const out: Record<string, unknown> = { ...data };
  if (out.date instanceof Date) {
    out.date = out.date.toISOString().slice(0, 10);
  }
  return out as ContentMeta;
}

function readDir(dir: string): string[] {
  const full = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));
}

export function getAllContent(section: string, locale: Locale): ContentItem[] {
  const files = readDir(section);
  const items: ContentItem[] = files
    .map((file) => {
      const slug = file.replace(/\.mdx?$/, "");
      const raw = fs.readFileSync(path.join(CONTENT_DIR, section, file), "utf8");
      const { data, content } = matter(raw);
      return { slug, meta: normalizeMeta(data), body: content };
    })
    .filter((item) => {
      if (item.meta.published === false) return false;
      if (item.meta.locale && item.meta.locale !== locale) return false;
      return true;
    })
    .sort((a, b) => {
      const ad = a.meta.date ? new Date(a.meta.date).getTime() : 0;
      const bd = b.meta.date ? new Date(b.meta.date).getTime() : 0;
      return bd - ad;
    });
  return items;
}

export function getContent(
  section: string,
  slug: string,
  locale: Locale,
): ContentItem | null {
  const candidates = [
    `${slug}.${locale}.md`,
    `${slug}.${locale}.mdx`,
    `${slug}.md`,
    `${slug}.mdx`,
  ];
  for (const file of candidates) {
    const p = path.join(CONTENT_DIR, section, file);
    if (fs.existsSync(p)) {
      const raw = fs.readFileSync(p, "utf8");
      const { data, content } = matter(raw);
      return { slug, meta: normalizeMeta(data), body: content };
    }
  }
  return null;
}
