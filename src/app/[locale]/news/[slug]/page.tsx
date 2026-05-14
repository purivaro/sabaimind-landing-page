import { notFound } from "next/navigation";
import { type Locale } from "@/i18n/config";
import { getContent } from "@/lib/content";
import { Markdown } from "@/components/Markdown";

export default async function NewsDetail({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const item = getContent("news", slug, locale);
  if (!item) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight">{item.meta.title}</h1>
      {item.meta.date && (
        <time className="mt-2 block text-sm text-zinc-500">{item.meta.date}</time>
      )}
      <div className="mt-8">
        <Markdown source={item.body} />
      </div>
    </article>
  );
}
