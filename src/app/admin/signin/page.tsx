import { redirect } from "next/navigation";
import { auth, signIn, isAdminEmail } from "@/auth";

export default async function SignInPage() {
  const session = await auth();
  if (isAdminEmail(session?.user?.email)) redirect("/admin/blog");

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-8 shadow-card">
        <h1 className="font-display text-2xl text-on-surface">Sabai Mind</h1>
        <p className="mt-1 text-body-md text-on-surface-variant">管理画面 / Admin</p>

        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/admin/blog" });
          }}
          className="mt-8"
        >
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-3 rounded-full border border-outline-variant/50 bg-surface-container-lowest px-5 py-3 font-label-md text-on-surface transition-colors hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-[20px]">login</span>
            Google でログイン
          </button>
        </form>

        <p className="mt-6 text-xs text-on-surface-variant">
          許可されたメールアドレスのみアクセスできます。
        </p>
      </div>
    </main>
  );
}
