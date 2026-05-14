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
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight">{t.nav.contact}</h1>
      <form
        action="/api/contact"
        method="post"
        className="mt-10 space-y-6"
      >
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-zinc-700">
            {t.contact.name}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="mt-2 block w-full rounded-md border border-zinc-300 px-4 py-2 focus:border-zinc-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
            {t.contact.email}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-2 block w-full rounded-md border border-zinc-300 px-4 py-2 focus:border-zinc-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-zinc-700">
            {t.contact.message}
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            required
            className="mt-2 block w-full rounded-md border border-zinc-300 px-4 py-2 focus:border-zinc-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-zinc-900 px-6 py-2.5 text-white font-medium hover:bg-zinc-700 transition-colors"
        >
          {t.contact.submit}
        </button>
      </form>
      <p className="mt-8 text-sm text-zinc-500">
        * Contact form endpoint (/api/contact) ยังไม่ได้เชื่อมต่อ email service — รอ Resend/SMTP setup
      </p>
    </div>
  );
}
