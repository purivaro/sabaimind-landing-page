import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/admin";

export default async function AdminRegistrationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const me = await getCurrentUser();
  if (!me) redirect("/admin/signin");
  if (!me.canManageRegistrations) redirect("/admin");
  return <>{children}</>;
}
