"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type Locale, locales, localeNames } from "@/i18n/config";

type Item = { href: string; label: string };

export function MobileMenu({
  locale,
  items,
}: {
  locale: Locale;
  items: Item[];
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const swapLocale = (target: Locale) => {
    const segments = (pathname || `/${locale}`).split("/").filter(Boolean);
    if (segments.length === 0) return `/${target}`;
    if (locales.includes(segments[0] as Locale)) {
      segments[0] = target;
    } else {
      segments.unshift(target);
    }
    return "/" + segments.join("/");
  };

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="md:hidden inline-flex items-center justify-center w-10 h-10 -mr-2 text-primary"
      >
        <span className="material-symbols-outlined text-[28px]">
          {open ? "close" : "menu"}
        </span>
      </button>

      {open && (
        <div className="md:hidden fixed inset-0 top-20 z-40 bg-background/95 backdrop-blur-md overflow-y-auto">
          <nav className="flex flex-col px-margin-mobile py-8 gap-2">
            {items.map((item) => (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                className="font-display text-2xl text-on-surface hover:text-primary transition-colors py-4 border-b border-outline-variant/30"
              >
                {item.label}
              </Link>
            ))}

            <div className="mt-8 pt-8 border-t border-outline-variant/30">
              <p className="font-label-md text-secondary uppercase tracking-widest mb-4">
                Language
              </p>
              <div className="flex flex-col gap-3">
                {locales.map((l) => (
                  <Link
                    key={l}
                    href={swapLocale(l)}
                    className={`font-body text-body-lg py-2 ${
                      l === locale
                        ? "font-semibold text-primary"
                        : "text-on-surface-variant hover:text-primary transition-colors"
                    }`}
                  >
                    {localeNames[l]}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
