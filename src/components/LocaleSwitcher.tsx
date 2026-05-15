"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type Locale, locales, localeNames } from "@/i18n/config";

export function LocaleSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname() || `/${current}`;

  const swapLocale = (target: Locale) => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return `/${target}`;
    if (locales.includes(segments[0] as Locale)) {
      segments[0] = target;
    } else {
      segments.unshift(target);
    }
    return "/" + segments.join("/");
  };

  return (
    <div className="flex items-center gap-2">
      <span className="material-symbols-outlined text-primary text-[20px]">
        language
      </span>
      <div className="flex items-center gap-1 font-label-md text-on-surface-variant">
        {locales.map((l, idx) => (
          <span key={l} className="flex items-center gap-1">
            {idx > 0 && <span className="opacity-40">/</span>}
            <Link
              href={swapLocale(l)}
              className={
                l === current
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
  );
}
