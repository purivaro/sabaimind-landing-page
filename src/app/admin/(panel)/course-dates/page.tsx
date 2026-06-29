import { getAllCohorts } from "@/lib/courseDates";
import { CourseDatesManager } from "@/components/admin/CourseDatesManager";
import { getAdminLang } from "@/lib/adminLang";
import { makeT } from "@/lib/adminI18n";

export const dynamic = "force-dynamic";

export default async function AdminCourseDatesPage() {
  const lang = await getAdminLang();
  const t = makeT(lang);
  const cohorts = await getAllCohorts();
  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-6">
        <p className="text-sm text-on-surface-variant">{t("cd.subtitle")}</p>
      </div>
      <CourseDatesManager initial={cohorts} lang={lang} />
    </main>
  );
}
