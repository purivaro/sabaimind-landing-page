import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { getCurrentUser } from "@/lib/admin";
import { getAdminLang } from "@/lib/adminLang";
import { makeT } from "@/lib/adminI18n";
import { LangSwitcher } from "@/components/admin/LangSwitcher";

export default async function SignInPage() {
  const me = await getCurrentUser();
  if (me) redirect("/admin");
  const lang = await getAdminLang();
  const t = makeT(lang);

  return (
    <main className="relative flex min-h-screen items-center justify-center px-6">
      <div className="absolute right-5 top-5">
        <LangSwitcher lang={lang} />
      </div>
      <div className="w-full max-w-sm rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-8 shadow-card">
        <h1 className="font-display text-2xl text-on-surface">
          {t("brand.title")}
        </h1>
        <p className="mt-1 text-body-md text-on-surface-variant">
          {t("login.sub")}
        </p>

        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/admin" });
          }}
          className="mt-8"
        >
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-3 rounded-full border border-outline-variant/50 bg-surface-container-lowest px-5 py-3 font-label-md text-on-surface transition-colors hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-[20px]">login</span>
            {t("login.google")}
          </button>
        </form>

        <p className="mt-6 text-xs text-on-surface-variant">
          {t("login.note")}
        </p>
      </div>
    </main>
  );
}
