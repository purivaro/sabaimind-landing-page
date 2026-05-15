import Link from "next/link";
import Image from "next/image";
import { type Locale, locales, localeNames } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export function Nav({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const items = [
    { href: "", label: t.nav.home },
    { href: "/about", label: t.nav.about },
    { href: "/activities", label: t.nav.activities },
    { href: "/news", label: t.nav.news },
    { href: "/videos", label: t.nav.videos },
    { href: "/contact", label: t.nav.contact },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-outline-variant/30 shadow-sm">
      <nav className="flex justify-between items-center h-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <Link href={`/${locale}`} className="flex items-center" aria-label={t.site.name}>
          <Image
            src="/images/logo/logo-sabiamind.png"
            alt={t.site.name}
            width={737}
            height={323}
            priority
            className="h-10 md:h-12 w-auto"
          />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {items.map((item) => (
            <Link
              key={item.href}
              href={`/${locale}${item.href}`}
              className="font-body text-body-md text-on-surface-variant hover:text-primary transition-colors duration-300"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">
            language
          </span>
          <div className="flex items-center gap-1 font-label-md text-on-surface-variant">
            {locales.map((l, idx) => (
              <span key={l} className="flex items-center gap-1">
                {idx > 0 && <span className="opacity-40">/</span>}
                <Link
                  href={`/${l}`}
                  className={
                    l === locale
                      ? "font-semibold text-primary"
                      : "hover:text-primary transition-colors"
                  }
                >
                  {localeNames[l]}
                </Link>
              </span>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
