import Image from "next/image";
import { type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = getDictionary(locale);

  return (
    <>
      {/* Editorial Founder Hero */}
      <section className="py-24 md:py-32 overflow-hidden">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
            <div className="md:col-span-5 order-2 md:order-1">
              <span className="font-label-md text-primary tracking-widest block mb-4 uppercase">
                {t.about.eyebrow}
              </span>
              <h1 className="font-display text-4xl md:text-display text-on-surface mb-8 whitespace-pre-line">
                {t.about.heroTitle}
              </h1>
              <p className="font-body text-body-lg text-on-surface-variant mb-6">
                {t.about.heroBody}
              </p>
              <p className="font-display italic text-headline-md text-primary mb-12">
                「{t.about.heroQuote}」
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-[1px] bg-outline-variant" />
                <div>
                  <p className="font-display text-body-lg text-on-surface">
                    {t.about.founderName}
                  </p>
                  <p className="font-body text-label-md text-on-surface-variant">
                    {t.about.founderRole}
                  </p>
                </div>
              </div>
            </div>
            <div className="md:col-span-7 order-1 md:order-2 relative">
              <div className="absolute inset-0 japanese-motif -z-10 translate-x-10 translate-y-10" />
              <Image
                src="/images/about/iso-minoru.jpg"
                alt={t.about.founderName}
                width={1200}
                height={1600}
                className="w-full aspect-[4/5] object-cover rounded shadow-lg"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Full Message from Representative */}
      <section className="py-24 md:py-32 bg-surface-container-low border-y border-outline-variant/20">
        <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center mb-12">
            <span className="font-label-md text-primary tracking-widest uppercase block mb-3">
              Message
            </span>
            <h2 className="font-display text-headline-lg text-on-surface">
              {t.about.sectionMessage}
            </h2>
          </div>
          <div className="space-y-6 font-body text-body-lg text-on-surface-variant leading-relaxed">
            {t.about.messageParagraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
          <div className="mt-12 flex items-center justify-end gap-4">
            <div className="text-right">
              <p className="font-display text-body-lg text-on-surface">
                {t.about.founderName}
              </p>
              <p className="font-body text-label-md text-on-surface-variant">
                {t.about.founderRole}
              </p>
            </div>
            <div className="w-12 h-[1px] bg-outline-variant" />
          </div>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="py-24 bg-surface border-b border-outline-variant/20">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center mb-16">
          <h2 className="font-display text-headline-lg text-on-surface">
            {t.about.sectionAspirations}
          </h2>
        </div>
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: "lightbulb", ...t.about.mission },
            { icon: "visibility", ...t.about.vision },
            { icon: "auto_awesome", ...t.about.values },
          ].map((item) => (
            <div key={item.title} className="text-center">
              <div className="mb-6 inline-flex p-4 rounded-full bg-primary-fixed/30 text-primary">
                <span className="material-symbols-outlined text-4xl">
                  {item.icon}
                </span>
              </div>
              <h3 className="font-display text-headline-md text-on-surface mb-4">
                {item.title}
              </h3>
              <p className="font-body text-body-md text-on-surface-variant">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Programs (事業内容) */}
      <section className="py-24 md:py-32 bg-surface-container-low border-b border-outline-variant/20">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center mb-16">
            <h2 className="font-display text-headline-lg text-on-surface mb-4">
              {t.about.sectionPrograms}
            </h2>
            <p className="font-body text-body-md text-on-surface-variant">
              {t.about.sectionProgramsSub}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {t.about.programs.map((p) => (
              <article
                key={p.title}
                className="bg-surface-container-lowest border border-outline-variant/20 rounded-lg p-10 group hover:shadow-[0_12px_32px_rgba(124,87,31,0.08)] transition-shadow"
              >
                <div className="mb-6 inline-flex p-4 rounded-full bg-secondary-fixed/40 text-secondary">
                  <span className="material-symbols-outlined text-3xl">
                    {p.icon}
                  </span>
                </div>
                <h3 className="font-display text-headline-md text-on-surface mb-4 leading-snug">
                  {p.title}
                </h3>
                <p className="font-body text-body-md text-on-surface-variant">
                  {p.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Community Engagement */}
      <section className="py-24 md:py-32 bg-surface">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
            <div className="md:col-span-7 relative">
              <div className="absolute inset-0 japanese-motif -z-10 -translate-x-6 translate-y-6" />
              <Image
                src="/images/about/mayor-visit.jpg"
                alt={t.about.sectionCommunity}
                width={1100}
                height={1430}
                className="w-full aspect-[4/5] md:aspect-[5/4] object-cover object-top rounded shadow-lg"
              />
            </div>
            <div className="md:col-span-5">
              <span className="font-label-md text-primary tracking-widest uppercase block mb-4">
                Community
              </span>
              <h2 className="font-display text-headline-lg text-on-surface mb-6">
                {t.about.sectionCommunity}
              </h2>
              <p className="font-body text-body-lg text-on-surface-variant leading-relaxed">
                {t.about.communityCaption}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Organization Info */}
      <section className="py-24 bg-surface-container-low border-y border-outline-variant/20">
        <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop">
          <h2 className="font-display text-headline-lg text-on-surface mb-12 text-center">
            {t.about.sectionOrg}
          </h2>
          <dl className="divide-y divide-outline-variant/30 border-t border-outline-variant/30">
            {t.about.orgFields.map((f) => (
              <div
                key={f.label}
                className="grid grid-cols-1 md:grid-cols-3 py-6 gap-2 md:gap-8"
              >
                <dt className="font-label-md text-secondary uppercase tracking-widest">
                  {f.label}
                </dt>
                <dd className="md:col-span-2 font-body text-body-md text-on-surface">
                  {f.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary-container">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center">
          <h2 className="font-display text-headline-lg text-on-primary-container mb-8">
            {t.about.ctaTitle}
          </h2>
          <p className="font-body text-body-lg text-on-primary-container/80 mb-12 max-w-2xl mx-auto">
            {t.about.ctaBody}
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button className="bg-primary text-on-primary px-12 py-4 rounded-lg font-label-md transition-all hover:scale-105 active:scale-95 shadow-md">
              {t.about.ctaVolunteer}
            </button>
            <button className="border border-secondary text-on-primary-container px-12 py-4 rounded-lg font-label-md transition-all hover:bg-secondary/10 active:scale-95">
              {t.about.ctaSupport}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
