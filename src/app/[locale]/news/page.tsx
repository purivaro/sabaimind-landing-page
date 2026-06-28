import Image from "next/image";
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
  const recent = items.slice(0, 2);

  return (
    <main className="pt-12 pb-16 md:pt-24 md:pb-24 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
      <header className="mb-16 md:mb-24">
        <h1 className="font-display text-3xl md:text-display text-on-surface mb-4">
          {t.news.title}
        </h1>
        <p className="font-body text-body-lg text-on-surface-variant max-w-2xl">
          {t.news.subtitle}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        {/* Article list */}
        <section className="lg:col-span-8">
          {items.length === 0 ? (
            <p className="text-on-surface-variant py-24">
              {locale === "ja" ? "現在ニュースはありません。" : "ยังไม่มีข่าวสารในขณะนี้"}
            </p>
          ) : (
            <div className="flex flex-col">
              {items.map((item) => (
                <Link
                  key={item.slug}
                  href={`/${locale}/news/${item.slug}`}
                  className="py-10 border-b border-on-surface/10 group cursor-pointer block"
                >
                  <div className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-8">
                    {item.meta.date && (
                      <time className="font-label-md text-secondary tracking-widest uppercase md:w-32 flex-shrink-0">
                        {item.meta.date}
                      </time>
                    )}
                    <div className="flex-grow">
                      <h2 className="font-display text-headline-md text-on-surface group-hover:text-primary transition-colors duration-300 mb-3">
                        {item.meta.title}
                      </h2>
                      {item.meta.excerpt && (
                        <p className="font-body text-body-md text-on-surface-variant line-clamp-2">
                          {item.meta.excerpt}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Sidebar */}
        <aside className="lg:col-span-4 mt-16 lg:mt-0 lg:sticky lg:top-32 space-y-16">
          {/* Recent */}
          {recent.length > 0 && (
            <section>
              <h3 className="font-display text-headline-md text-on-surface mb-6 border-b border-on-surface/10 pb-4">
                {t.news.recentTitle}
              </h3>
              <div className="space-y-6">
                {recent.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/${locale}/news/${item.slug}`}
                    className="flex gap-4 group"
                  >
                    <div className="w-20 h-20 bg-surface-container overflow-hidden rounded-lg flex-shrink-0 relative">
                      <Image
                        src={
                          (item.meta.cover as string | undefined) ||
                          "/images/news/stones.jpg"
                        }
                        alt={item.meta.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div>
                      {item.meta.date && (
                        <time className="text-[12px] text-secondary font-medium tracking-wider uppercase">
                          {item.meta.date}
                        </time>
                      )}
                      <p className="font-body text-body-md text-on-surface leading-snug mt-1 group-hover:text-primary line-clamp-2">
                        {item.meta.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>
    </main>
  );
}
