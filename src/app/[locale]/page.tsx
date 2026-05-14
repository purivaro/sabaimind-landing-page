import Link from "next/link";
import { type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = getDictionary(locale);

  const sections = [
    { href: "about", label: t.nav.about },
    { href: "activities", label: t.nav.activities },
    { href: "news", label: t.nav.news },
    { href: "videos", label: t.nav.videos },
    { href: "contact", label: t.nav.contact },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <h1 className="text-5xl font-bold tracking-tight">{t.site.name}</h1>
      <p className="mt-4 text-lg text-zinc-600">{t.site.tagline}</p>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={`/${locale}/${s.href}`}
            className="block rounded-lg border border-zinc-200 p-6 hover:border-zinc-400 transition-colors"
          >
            <span className="text-lg font-medium">{s.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
