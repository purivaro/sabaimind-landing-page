import { notFound } from "next/navigation";
import { type Locale } from "@/i18n/config";
import { getContent } from "@/lib/content";
import { Markdown } from "@/components/Markdown";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const item = getContent("about", locale, locale);
  if (!item) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight">{item.meta.title}</h1>
      <div className="mt-8">
        <Markdown source={item.body} />
      </div>
    </article>
  );
}
