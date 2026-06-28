"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type Locale } from "@/i18n/config";

type Item = { href: string; label: string };

export function NavLinks({
  locale,
  items,
}: {
  locale: Locale;
  items: Item[];
}) {
  const pathname = usePathname() || `/${locale}`;

  const isActive = (href: string) => {
    const full = `/${locale}${href}`;
    if (href === "") return pathname === `/${locale}`;
    return pathname === full || pathname.startsWith(`${full}/`);
  };

  return (
    <div className="hidden lg:flex items-center gap-1">
      {items.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={`/${locale}${item.href}`}
            aria-current={active ? "page" : undefined}
            className={`relative px-3.5 py-2 rounded-full font-body text-[0.95rem] transition-colors duration-200 ${
              active
                ? "text-primary"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {item.label}
            <span
              className={`pointer-events-none absolute left-3.5 right-3.5 -bottom-0.5 h-px origin-center bg-primary transition-transform duration-300 ${
                active ? "scale-x-100" : "scale-x-0"
              }`}
            />
          </Link>
        );
      })}
    </div>
  );
}
