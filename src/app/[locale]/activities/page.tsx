import Link from "next/link";
import Image from "next/image";
import { type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getAllContent } from "@/lib/content";

export default async function ActivitiesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const items = getAllContent("activities", locale);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight">{t.nav.activities}</h1>
      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`/${locale}/activities/${item.slug}`}
            className="block group"
          >
            {item.meta.cover && (
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-zinc-100">
                <Image
                  src={item.meta.cover}
                  alt={item.meta.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              </div>
            )}
            <h2 className="mt-3 text-xl font-semibold">{item.meta.title}</h2>
            {item.meta.date && (
              <time className="text-sm text-zinc-500">{item.meta.date}</time>
            )}
            {item.meta.excerpt && (
              <p className="mt-2 text-zinc-600">{item.meta.excerpt}</p>
            )}
          </Link>
        ))}
        {items.length === 0 && (
          <p className="text-zinc-500">ยังไม่มีรายการ</p>
        )}
      </div>
    </div>
  );
}
