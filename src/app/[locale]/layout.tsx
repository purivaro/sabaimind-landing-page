import type { Metadata, Viewport } from "next";
import { Noto_Serif_JP, Noto_Sans_JP } from "next/font/google";
import "../globals.css";
import { notFound } from "next/navigation";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

const SITE_URL = "https://sabaimind.or.jp";

const notoSerifJP = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const seo: Record<Locale, {
  title: string;
  titleTemplate: string;
  description: string;
  keywords: string[];
  locale: string;
  ogAlt: string;
}> = {
  ja: {
    title: "NPO法人サバーイマインド — 心に休息を届ける瞑想とマインドフルネス",
    titleTemplate: "%s | NPO法人サバーイマインド",
    description:
      "NPO法人サバーイマインドは、タイの伝統的なマインドフルネスを日本に届け、現代社会に心の休息の場をつくる活動を行っています。瞑想会、瞑想指導者派遣、ソンクラーン祭・スカイランタン祭など、タイ文化を通じた地域交流を実施しています。",
    keywords: [
      "Sabai Mind",
      "サバーイマインド",
      "マインドフルネス",
      "瞑想",
      "瞑想会",
      "瞑想指導者派遣",
      "ソンクラーン祭",
      "スカイランタン祭",
      "栃木",
      "宇都宮",
      "那須烏山",
      "NPO法人",
      "心の休息",
      "心のケア",
    ],
    locale: "ja_JP",
    ogAlt: "Sabai Mind スカイランタン祭の様子",
  },
  en: {
    title: "Sabai Mind NPO — Bringing peace of mind to Japan through Thai mindfulness",
    titleTemplate: "%s | Sabai Mind NPO",
    description:
      "Sabai Mind NPO brings traditional Thai mindfulness to Japan through meditation sessions, instructor dispatch, and cultural events such as the Songkran Festival and the Sky Lantern Festival in Tochigi.",
    keywords: [
      "Sabai Mind",
      "mindfulness",
      "meditation",
      "Thai meditation",
      "Anapanasati",
      "Theravada",
      "Songkran Festival Japan",
      "Sky Lantern Festival",
      "Tochigi",
      "Utsunomiya",
      "Nasukarasuyama",
      "NPO Japan",
      "mental rest",
      "mental wellness",
    ],
    locale: "en_US",
    ogAlt: "Sabai Mind Sky Lantern Festival",
  },
};

export const viewport: Viewport = {
  themeColor: "#7c571f",
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const s = seo[locale];
  const url = `${SITE_URL}/${locale}`;
  const ogImage = `${SITE_URL}/opengraph-image.jpg`;
  const organizationName =
    locale === "ja" ? "NPO法人サバーイマインド" : "Sabai Mind NPO";

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: s.title,
      template: s.titleTemplate,
    },
    description: s.description,
    keywords: [...s.keywords],
    authors: [{ name: organizationName }],
    creator: organizationName,
    publisher: organizationName,
    applicationName: organizationName,
    referrer: "origin-when-cross-origin",
    formatDetection: { email: false, telephone: false, address: false },
    alternates: {
      canonical: url,
      languages: {
        ja: `${SITE_URL}/ja`,
        en: `${SITE_URL}/en`,
        "x-default": `${SITE_URL}/ja`,
      },
    },
    openGraph: {
      type: "website",
      url,
      siteName: organizationName,
      title: s.title,
      description: s.description,
      locale: s.locale,
      alternateLocale: (
        ["ja_JP", "en_US"] as const
      ).filter((l) => l !== s.locale) as string[],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: s.ogAlt,
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: s.title,
      description: s.description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: s.ogAlt,
        },
      ],
    },
    icons: {
      icon: "/icon.png",
      apple: "/apple-icon.png",
      shortcut: "/icon.png",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: organizationName,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const typedLocale = locale as Locale;

  return (
    <html
      lang={typedLocale}
      className={`${notoSerifJP.variable} ${notoSansJP.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-on-surface">
        <Nav locale={typedLocale} />
        <main className="flex-1 pt-20">{children}</main>
        <Footer locale={typedLocale} />
      </body>
      <GoogleAnalytics gaId="G-EVPQ5JME68" />
    </html>
  );
}
