import Link from "next/link";
import { type Locale, locales, localeNames } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export function Nav({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const items = [
    { href: "", label: t.site.name },
    { href: "/about", label: t.nav.about },
    { href: "/activities", label: t.nav.activities },
    { href: "/news", label: t.nav.news },
    { href: "/videos", label: t.nav.videos },
    { href: "/contact", label: t.nav.contact },
  ];

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <Link href={`/${locale}`} className="text-xl font-semibold tracking-tight">
          {t.site.name}
        </Link>
        <nav className="flex flex-wrap items-center gap-6 text-sm text-zinc-700">
          {items.slice(1).map((item) => (
            <Link
              key={item.href}
              href={`/${locale}${item.href}`}
              className="hover:text-black transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          {locales.map((l, idx) => (
            <span key={l} className="flex items-center gap-2">
              {idx > 0 && <span>·</span>}
              <Link
                href={`/${l}`}
                className={l === locale ? "font-semibold text-black" : "hover:text-black"}
              >
                {localeNames[l]}
              </Link>
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
