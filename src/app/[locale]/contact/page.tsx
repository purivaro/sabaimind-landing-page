import Image from "next/image";
import { type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = getDictionary(locale);

  return (
    <main className="pt-12 pb-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      {/* Hero */}
      <section className="mb-16 md:mb-24 text-center">
        <h1 className="font-display text-4xl md:text-display text-primary mb-6">
          {t.contact.title}
        </h1>
        <p className="font-body text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          {t.contact.subtitle}
        </p>
      </section>

      {/* Contact card */}
      <section className="max-w-3xl mx-auto bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 p-8 md:p-12">
        <h2 className="font-display text-headline-md text-secondary mb-8 text-center">
          {t.contact.sidebarTitle}
        </h2>

        <ul className="space-y-6 font-body text-body-md text-on-surface-variant max-w-md mx-auto">
          <li className="flex items-start gap-4">
            <span className="material-symbols-outlined text-primary mt-0.5">
              location_on
            </span>
            <span>
              {t.contact.addressLine1}
              {t.contact.addressLine2 && (
                <>
                  <br />
                  {t.contact.addressLine2}
                </>
              )}
            </span>
          </li>
          <li className="flex items-center gap-4">
            <span className="material-symbols-outlined text-primary">
              call
            </span>
            <a
              href={`tel:${t.contact.phone.replace(/\D/g, "")}`}
              className="hover:text-primary transition-colors"
            >
              {t.contact.phone}
            </a>
          </li>
          <li className="flex items-center gap-4">
            <span className="material-symbols-outlined text-primary">
              mail
            </span>
            <a
              href={`mailto:${t.contact.email}`}
              className="hover:text-primary transition-colors"
            >
              {t.contact.email}
            </a>
          </li>
        </ul>

        <div className="mt-10 flex justify-center">
          <a
            href={`mailto:${t.contact.email}`}
            className="inline-flex items-center gap-2 px-12 py-4 bg-primary-container text-on-primary-container font-label-md rounded-full hover:shadow-lg active:scale-95 transition-all duration-300 uppercase tracking-widest"
          >
            <span className="material-symbols-outlined text-[20px]">mail</span>
            {t.contact.email}
          </a>
        </div>

      </section>

      {/* Map */}
      <section className="max-w-3xl mx-auto mt-12">
        <a
          href="https://maps.app.goo.gl/2KFSJnPovTrtVgRD8"
          target="_blank"
          rel="noopener noreferrer"
          className="relative group block overflow-hidden rounded-xl h-64 md:h-80 border border-outline-variant/20 shadow-sm"
        >
          <Image
            src="/images/contact/map.jpg"
            alt="Sabai Mind location"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 768px"
          />
          <div className="absolute inset-0 bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="inline-flex items-center gap-2 bg-surface-container-lowest px-6 py-2 rounded-full font-label-md text-primary shadow-md">
              <span className="material-symbols-outlined text-[20px]">map</span>
              Open in Maps
            </span>
          </div>
        </a>
      </section>
    </main>
  );
}
