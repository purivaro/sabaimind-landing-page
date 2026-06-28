import Link from "next/link";
import Image from "next/image";
import { type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export function Footer({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <footer className="bg-surface-container-low border-t border-outline-variant/20">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16 flex flex-col md:flex-row justify-between gap-gutter">
        <div className="md:max-w-sm">
          <Image
            src="/images/logo/logo-sabiamind.png"
            alt={t.site.name}
            width={737}
            height={323}
            className="h-12 w-auto mb-6"
          />
          <p className="font-body text-body-md text-on-surface-variant">
            {t.site.footerDescription}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-16">
          <div>
            <h4 className="font-label-md text-secondary uppercase mb-6 tracking-widest">
              {t.footer.explore}
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href={`/${locale}/activities`}
                  className="font-body text-body-md text-on-surface-variant hover:text-primary transition-colors"
                >
                  {t.nav.activities}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/news`}
                  className="font-body text-body-md text-on-surface-variant hover:text-primary transition-colors"
                >
                  {t.nav.news}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/videos`}
                  className="font-body text-body-md text-on-surface-variant hover:text-primary transition-colors"
                >
                  {t.nav.videos}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/contact`}
                  className="font-body text-body-md text-on-surface-variant hover:text-primary transition-colors"
                >
                  {t.nav.contact}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-label-md text-secondary uppercase mb-6 tracking-widest">
              {t.footer.legal}
            </h4>
            <ul className="space-y-4">
              <li>
                <span className="font-body text-body-md text-on-surface-variant">
                  {t.footer.privacy}
                </span>
              </li>
              <li>
                <span className="font-body text-body-md text-on-surface-variant">
                  {t.footer.terms}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 border-t border-outline-variant/10 text-center">
        <p className="font-label-md text-on-surface-variant">
          {t.site.rights}
        </p>
      </div>
    </footer>
  );
}
