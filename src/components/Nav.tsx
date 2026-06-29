import Link from "next/link";
import Image from "next/image";
import { type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";

export function Nav({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const items = [
    { href: "", label: t.nav.home },
    { href: "/about", label: t.nav.about },
    { href: "/activities", label: t.nav.activities },
    { href: "/news", label: t.nav.news },
    { href: "/videos", label: t.nav.videos },
    { href: "/blog", label: t.nav.blog },
    { href: "/contact", label: t.nav.contact },
  ];

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-5 md:pt-4">
      <nav className="pointer-events-auto mx-auto flex h-14 max-w-container-max items-center justify-between gap-3 rounded-full border border-outline-variant/40 bg-surface/95 pl-4 pr-2.5 shadow-nav backdrop-blur-xl md:h-16 md:pl-6 md:pr-3">
        <Link
          href={`/${locale}`}
          className="flex shrink-0 items-center"
          aria-label={t.site.name}
        >
          <Image
            src="/images/logo/logo-sabiamind.png"
            alt={t.site.name}
            width={737}
            height={323}
            priority
            className="h-8 w-auto md:h-9"
          />
        </Link>

        <NavLinks locale={locale} items={items} />

        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden lg:block">
            <LocaleSwitcher current={locale} />
          </div>
          <Link
            href={`/${locale}/register`}
            className="hidden items-center rounded-full bg-primary px-5 py-2.5 font-label-md uppercase tracking-wide text-on-primary shadow-[0_6px_16px_-6px_rgb(124_87_31_/_0.6)] transition-all duration-200 hover:bg-primary-fixed-dim hover:text-on-primary-fixed active:translate-y-px lg:inline-flex"
          >
            {t.nav.register}
          </Link>
          <MobileMenu
            locale={locale}
            items={[...items, { href: "/register", label: t.nav.register }]}
          />
        </div>
      </nav>
    </header>
  );
}
