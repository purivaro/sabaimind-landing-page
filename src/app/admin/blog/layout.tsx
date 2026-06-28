import { redirect } from "next/navigation";
import Link from "next/link";
import { auth, isAdminEmail, signOut } from "@/auth";

export default async function AdminBlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!isAdminEmail(session?.user?.email)) redirect("/admin/signin");

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-outline-variant/30 bg-surface-container-lowest/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-3">
          <Link href="/admin/blog" className="font-semibold text-on-surface">
            Sabai Mind <span className="text-on-surface-variant">/ ブログ管理</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/blog/new"
              className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-fixed-dim hover:text-on-primary-fixed"
            >
              + 新規作成
            </Link>
            <span className="hidden text-sm text-on-surface-variant sm:inline">
              {session!.user!.email}
            </span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/admin/signin" });
              }}
            >
              <button className="text-sm text-on-surface-variant hover:text-on-surface">
                ログアウト
              </button>
            </form>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
