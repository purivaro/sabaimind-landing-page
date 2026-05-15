import Image from "next/image";
import Link from "next/link";
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
    <main className="py-16 md:py-24 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
      {/* Header */}
      <header className="mb-16 text-center max-w-2xl mx-auto">
        <h1 className="font-display text-4xl md:text-[48px] font-bold text-primary mb-4 leading-tight">
          {t.activities.title}
        </h1>
        <p className="text-on-surface-variant font-body text-body-md leading-relaxed">
          {t.activities.subtitle}
        </p>
      </header>

      {items.length === 0 ? (
        <p className="text-center text-on-surface-variant py-24">
          {locale === "ja" ? "現在予定されているイベントはありません。" : "ยังไม่มีกิจกรรมในขณะนี้"}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          {items.map((item, idx) => {
            const isFeature = idx === 0;
            const isWide = idx === 3;
            const colSpan = isFeature || isWide ? "md:col-span-8" : "md:col-span-4";
            const imgHeight = isFeature ? "h-[400px]" : "h-[240px]";

            if (isWide) {
              return (
                <Link
                  key={item.slug}
                  href={`/${locale}/activities/${item.slug}`}
                  className="md:col-span-8 bg-surface-container-lowest rounded-lg shadow-[0_12px_24px_rgba(200,155,92,0.08)] border border-outline-variant/10 overflow-hidden group flex flex-col md:flex-row"
                >
                  <div className="md:w-2/5 relative overflow-hidden h-[280px] md:h-auto bg-surface-container">
                    {item.meta.cover && (
                      <Image
                        src={item.meta.cover}
                        alt={item.meta.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 30vw"
                      />
                    )}
                  </div>
                  <div className="md:w-3/5 p-8 flex flex-col justify-center">
                    {item.meta.date && (
                      <p className="text-primary font-label-md mb-2">{item.meta.date}</p>
                    )}
                    <h3 className="font-display text-headline-lg text-on-surface mb-3 group-hover:text-primary transition-colors">
                      {item.meta.title}
                    </h3>
                    {item.meta.excerpt && (
                      <p className="text-on-surface-variant font-body text-body-md line-clamp-3 mb-6">
                        {item.meta.excerpt}
                      </p>
                    )}
                    <span className="inline-flex items-center text-primary font-label-md">
                      {t.activities.detail}
                      <span className="material-symbols-outlined ml-2 transition-transform group-hover:translate-x-1 text-[20px]">
                        open_in_new
                      </span>
                    </span>
                  </div>
                </Link>
              );
            }

            return (
              <Link
                key={item.slug}
                href={`/${locale}/activities/${item.slug}`}
                className={`${colSpan} bg-surface-container-lowest rounded-lg shadow-[0_12px_24px_rgba(200,155,92,0.08)] border border-outline-variant/10 overflow-hidden group flex flex-col`}
              >
                <div className={`relative ${imgHeight} overflow-hidden bg-surface-container`}>
                  {item.meta.cover && (
                    <Image
                      src={item.meta.cover}
                      alt={item.meta.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes={isFeature ? "(max-width: 768px) 100vw, 60vw" : "(max-width: 768px) 100vw, 33vw"}
                      priority={isFeature}
                    />
                  )}
                </div>
                <div className={`${isFeature ? "p-8" : "p-6"} flex-grow`}>
                  {item.meta.date && (
                    <p className="text-primary font-label-md mb-2">{item.meta.date}</p>
                  )}
                  <h3
                    className={`font-display ${
                      isFeature ? "text-headline-lg" : "text-headline-md"
                    } text-on-surface mb-3 group-hover:text-primary transition-colors`}
                  >
                    {item.meta.title}
                  </h3>
                  {item.meta.excerpt && (
                    <p className="text-on-surface-variant font-body text-body-md line-clamp-2">
                      {item.meta.excerpt}
                    </p>
                  )}
                  {isFeature && (
                    <span className="inline-flex items-center text-primary font-label-md mt-6">
                      {t.activities.readMore}
                      <span className="material-symbols-outlined ml-2 transition-transform group-hover:translate-x-1 text-[20px]">
                        arrow_forward
                      </span>
                    </span>
                  )}
                </div>
              </Link>
            );
          })}

          {/* CTA Card */}
          <div className="md:col-span-12 bg-primary/5 rounded-lg border border-primary/20 flex flex-col items-center justify-center p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-5 -mr-12 -mt-12">
              <span className="material-symbols-outlined text-[200px]">eco</span>
            </div>
            <h3 className="font-display text-headline-lg text-primary mb-4">
              {t.activities.ctaTitle}
            </h3>
            <p className="text-on-surface-variant font-body text-body-md max-w-lg mb-8">
              {t.activities.ctaBody}
            </p>
            <Link
              href={`/${locale}/contact`}
              className="bg-primary text-on-primary px-10 py-4 rounded-full font-label-md shadow-md hover:shadow-xl transition-all duration-300 active:scale-95"
            >
              {t.activities.ctaButton}
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
