import { getAllCohorts } from "@/lib/courseDates";
import { CourseDatesManager } from "@/components/admin/CourseDatesManager";

export const dynamic = "force-dynamic";

export default async function AdminCourseDatesPage() {
  const cohorts = await getAllCohorts();
  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-on-surface">開催日の管理</h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          申し込みフォームに表示される開催日を管理します。非アクティブ・過去日は自動的に非表示になります。
        </p>
      </div>
      <CourseDatesManager initial={cohorts} />
    </main>
  );
}
