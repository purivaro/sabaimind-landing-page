import Image from "next/image";
import Link from "next/link";
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
    <main className="pt-12 pb-24">
      <header className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-20 text-center">
        <h1 className="font-display text-4xl md:text-display text-primary mb-6">
          {t.videos.title}
        </h1>
        <p className="font-body text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          {t.videos.subtitle}
        </p>
      </header>

      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        {items.length === 0 ? (
          <p className="text-center text-on-surface-variant py-24">
            {locale === "ja" ? "動画はまだありません。" : "ยังไม่มีวิดีโอในขณะนี้"}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-gutter">
            {items.map((item) => {
              const thumb = item.meta.youtube
                ? getYouTubeThumbnail(item.meta.youtube)
                : (item.meta.cover as string | undefined);
              return (
                <Link
                  key={item.slug}
                  href={`/${locale}/videos/${item.slug}`}
                  className="group cursor-pointer block"
                >
                  <div className="relative aspect-video overflow-hidden rounded-xl mb-6 shadow-sm border border-outline-variant/20 transition-transform duration-500 ease-out group-hover:scale-[1.02] group-hover:shadow-lg bg-surface-container">
                    {thumb && (
                      <Image
                        src={thumb}
                        alt={item.meta.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1120px) 50vw, 33vw"
                        unoptimized={!!item.meta.youtube}
                      />
                    )}
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform duration-300">
                        <span className="material-symbols-outlined text-primary text-4xl">
                          play_arrow
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    {item.meta.date && (
                      <span className="font-label-md text-secondary bg-secondary/10 px-3 py-1 rounded-full mb-3 inline-block">
                        {item.meta.date}
                      </span>
                    )}
                    <h3 className="font-display text-headline-md text-on-surface mb-2 leading-tight group-hover:text-primary transition-colors">
                      {item.meta.title}
                    </h3>
                    {item.meta.excerpt && (
                      <p className="font-body text-body-md text-on-surface-variant">
                        {item.meta.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
