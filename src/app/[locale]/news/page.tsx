import Link from "next/link";
import { type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getAllContent } from "@/lib/content";

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const items = getAllContent("news", locale);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight">{t.nav.news}</h1>
      <ul className="mt-10 divide-y divide-zinc-200">
        {items.map((item) => (
          <li key={item.slug} className="py-6">
            <Link
              href={`/${locale}/news/${item.slug}`}
              className="group block"
            >
              {item.meta.date && (
                <time className="text-sm text-zinc-500">{item.meta.date}</time>
              )}
              <h2 className="mt-1 text-xl font-semibold group-hover:text-zinc-600">
                {item.meta.title}
              </h2>
              {item.meta.excerpt && (
                <p className="mt-2 text-zinc-600">{item.meta.excerpt}</p>
              )}
            </Link>
          </li>
        ))}
        {items.length === 0 && (
          <li className="py-6 text-zinc-500">ยังไม่มีข่าวสาร</li>
        )}
      </ul>
    </div>
  );
}
