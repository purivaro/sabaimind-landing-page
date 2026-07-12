import type { MetadataRoute } from "next";
import { locales, type Locale } from "@/i18n/config";
import { getAllContent } from "@/lib/content";

const SITE_URL = "https://sabaimind.or.jp";
const lastModified = new Date("2026-07-12");

const staticPaths = [
  "",
  "/about",
  "/activities",
  "/activities/utsunomiya-meditation-course",
  "/register",
  "/contact",
  "/news",
  "/videos",
  "/blog",
] as const;

function localizedUrl(locale: Locale, path: string) {
  return `${SITE_URL}/${locale}${path}`;
}

function localizedEntry(
  locale: Locale,
  path: string,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly",
): MetadataRoute.Sitemap[number] {
  return {
    url: localizedUrl(locale, path),
    lastModified,
    changeFrequency,
    priority,
    alternates: {
      languages: {
        ja: localizedUrl("ja", path),
        en: localizedUrl("en", path),
        "x-default": localizedUrl("ja", path),
      },
    },
  };
}

function contentEntries(
  section: "activities" | "news" | "videos",
): MetadataRoute.Sitemap {
  return locales.flatMap((locale) =>
    getAllContent(section, locale).map((item) => ({
      url: localizedUrl(locale, `/${section}/${item.slug}`),
      lastModified: item.meta.date ? new Date(item.meta.date) : lastModified,
      changeFrequency: section === "news" ? "weekly" : "monthly",
      priority:
        section === "activities" &&
        item.slug === "utsunomiya-meditation-course"
          ? 0.95
          : section === "activities"
            ? 0.75
            : 0.55,
      alternates: {
        languages: {
          ja: localizedUrl("ja", `/${section}/${item.slug}`),
          en: localizedUrl("en", `/${section}/${item.slug}`),
          "x-default": localizedUrl("ja", `/${section}/${item.slug}`),
        },
      },
    })),
  );
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = locales.flatMap((locale) =>
    staticPaths.map((path) =>
      localizedEntry(
        locale,
        path,
        path === ""
          ? 1
          : path === "/activities/utsunomiya-meditation-course"
            ? 0.95
            : path === "/register"
              ? 0.9
              : 0.7,
        path === "/news" || path === "/blog" ? "weekly" : "monthly",
      ),
    ),
  );

  return [
    ...staticEntries,
    ...contentEntries("activities"),
    ...contentEntries("news"),
    ...contentEntries("videos"),
  ];
}
