"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ADMIN_LANGS, LANG_LABEL, type AdminLang } from "@/lib/adminI18n";

/** ja / th / en segmented switch. Persists to the `admin_lang` cookie and
 *  refreshes so server-rendered admin pages re-render in the chosen language. */
export function LangSwitcher({ lang }: { lang: AdminLang }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function choose(l: AdminLang) {
    if (l === lang) return;
    // 1 year, site-wide.
    document.cookie = `admin_lang=${l}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => router.refresh());
  }

  return (
    <div
      className="inline-flex items-center rounded-full border border-outline-variant/40 bg-surface-container-low p-0.5 text-xs"
      role="group"
      aria-label="Language"
    >
      {ADMIN_LANGS.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => choose(l)}
          disabled={pending}
          className={`rounded-full px-2.5 py-1 font-medium transition-colors ${
            l === lang
              ? "bg-primary text-on-primary"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          {LANG_LABEL[l]}
        </button>
      ))}
    </div>
  );
}
