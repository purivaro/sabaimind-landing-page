import { redirect } from "next/navigation";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { getCurrentUser } from "@/lib/admin";

export default async function AdminBlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const me = await getCurrentUser();
  if (!me) redirect("/admin/signin");
  if (!me.canWriteBlog) redirect("/admin");

  return (
    <div className="min-h-screen">
      <AdminHeader me={me} />
      <div className="mx-auto flex max-w-6xl justify-end px-6 pt-4">
        <Link
          href="/admin/blog/new"
          className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-fixed-dim hover:text-on-primary-fixed"
        >
          + 新規作成
        </Link>
      </div>
      {children}
    </div>
  );
}
