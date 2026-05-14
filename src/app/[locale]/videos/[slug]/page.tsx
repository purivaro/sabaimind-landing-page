import { notFound } from "next/navigation";
import { type Locale } from "@/i18n/config";
import { getContent } from "@/lib/content";
import { getYouTubeEmbed } from "@/lib/youtube";
import { Markdown } from "@/components/Markdown";

export default async function VideoDetail({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const item = getContent("videos", slug, locale);
  if (!item) notFound();

  const embed = item.meta.youtube ? getYouTubeEmbed(item.meta.youtube) : null;

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight">{item.meta.title}</h1>
      {item.meta.date && (
        <time className="mt-2 block text-sm text-zinc-500">{item.meta.date}</time>
      )}
      {embed && (
        <div className="relative mt-6 aspect-video overflow-hidden rounded-lg bg-black">
          <iframe
            src={embed}
            title={item.meta.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
      )}
      <div className="mt-8">
        <Markdown source={item.body} />
      </div>
    </article>
  );
}
