import { type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export function Footer({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <footer className="mt-24 border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-zinc-500">
        © {new Date().getFullYear()} {t.site.name}
      </div>
    </footer>
  );
}
