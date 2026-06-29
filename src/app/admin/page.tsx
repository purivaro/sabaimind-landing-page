import { redirect } from "next/navigation";
import { signOut } from "@/auth";
import { getCurrentUser } from "@/lib/admin";
import { getAdminLang } from "@/lib/adminLang";
import { makeT } from "@/lib/adminI18n";

export default async function AdminHome() {
  const me = await getCurrentUser();
  if (!me) redirect("/admin/signin");
  // Land on the first section this user can access.
  if (me.canWriteBlog) redirect("/admin/blog");
  if (me.canManageRegistrations) redirect("/admin/registrations");
  if (me.canManageCourseDates) redirect("/admin/course-dates");
  if (me.isAdmin) redirect("/admin/users");

  // Signed in, but no admin sections (e.g. a notification-only team member).
  const t = makeT(await getAdminLang());
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-8 text-center shadow-card">
        <span className="material-symbols-outlined text-[40px] text-on-surface-variant">
          lock
        </span>
        <h1 className="mt-2 font-display text-xl text-on-surface">
          {t("noaccess.title")}
        </h1>
        <p className="mt-2 text-sm text-on-surface-variant">
          {t("noaccess.body")}
        </p>
        <p className="mt-4 text-xs text-on-surface-variant">{me.email}</p>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/admin/signin" });
          }}
          className="mt-6"
        >
          <button
            type="submit"
            className="rounded-full border border-outline-variant/50 px-5 py-2 text-sm text-on-surface hover:bg-surface-container"
          >
            {t("common.logout")}
          </button>
        </form>
      </div>
    </main>
  );
}
