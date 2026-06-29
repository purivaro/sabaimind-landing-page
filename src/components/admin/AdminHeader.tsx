import Link from "next/link";
import { signOut } from "@/auth";
import type { Me } from "@/lib/admin";

/** Admin top bar. Nav links are shown per the signed-in user's permissions. */
export function AdminHeader({ me }: { me: Me }) {
  const nav: { href: string; label: string }[] = [];
  if (me.canWriteBlog) nav.push({ href: "/admin/blog", label: "ブログ" });
  if (me.canManageRegistrations)
    nav.push({ href: "/admin/registrations", label: "申込" });
  if (me.canManageCourseDates)
    nav.push({ href: "/admin/course-dates", label: "開催日" });
  if (me.isAdmin) nav.push({ href: "/admin/users", label: "ユーザー" });

  return (
    <header className="sticky top-0 z-10 border-b border-outline-variant/30 bg-surface-container-lowest/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-3">
        <div className="flex items-center gap-5">
          <Link href="/admin" className="font-semibold text-on-surface">
            Sabai Mind <span className="text-on-surface-variant">/ 管理</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="text-on-surface-variant hover:text-on-surface"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-on-surface-variant sm:inline">
            {me.email}
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
