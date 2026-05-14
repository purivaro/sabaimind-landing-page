import Link from "next/link";
import Image from "next/image";
import { type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getAllContent } from "@/lib/content";
import { getYouTubeThumbnail } from "@/lib/youtube";

export default async function VideosPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const items = getAllContent("videos", locale);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight">{t.nav.videos}</h1>
      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const thumb = item.meta.youtube
            ? getYouTubeThumbnail(item.meta.youtube)
            : null;
          return (
            <Link
              key={item.slug}
              href={`/${locale}/videos/${item.slug}`}
              className="block group"
            >
              {thumb && (
                <div className="relative aspect-video overflow-hidden rounded-lg bg-zinc-100">
                  <Image
                    src={thumb}
                    alt={item.meta.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                    sizes="(max-width: 640px) 100vw, 33vw"
                    unoptimized
                  />
                </div>
              )}
              <h2 className="mt-3 text-lg font-semibold">{item.meta.title}</h2>
              {item.meta.excerpt && (
                <p className="mt-1 text-sm text-zinc-600">{item.meta.excerpt}</p>
              )}
            </Link>
          );
        })}
        {items.length === 0 && (
          <p className="text-zinc-500">ยังไม่มีวิดีโอ</p>
        )}
      </div>
    </div>
  );
}
