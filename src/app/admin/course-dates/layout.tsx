import { redirect } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { getCurrentUser } from "@/lib/admin";

export default async function AdminCourseDatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const me = await getCurrentUser();
  if (!me) redirect("/admin/signin");
  if (!me.canManageCourseDates) redirect("/admin");

  return (
    <div className="min-h-screen">
      <AdminHeader me={me} />
      {children}
    </div>
  );
}
