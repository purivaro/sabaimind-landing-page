import Link from "next/link";
import { signOut } from "@/auth";

export function AdminHeader({ email }: { email: string }) {
  return (
    <header className="sticky top-0 z-10 border-b border-outline-variant/30 bg-surface-container-lowest/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-3">
        <div className="flex items-center gap-5">
          <Link href="/admin/blog" className="font-semibold text-on-surface">
            Sabai Mind <span className="text-on-surface-variant">/ 管理</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/admin/blog" className="text-on-surface-variant hover:text-on-surface">
              ブログ
            </Link>
            <Link href="/admin/registrations" className="text-on-surface-variant hover:text-on-surface">
              申込
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-on-surface-variant sm:inline">
            {email}
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
  );
}
