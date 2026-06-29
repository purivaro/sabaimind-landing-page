import { redirect } from "next/navigation";
import { auth, isAdminEmail } from "@/auth";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default async function AdminRegistrationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!isAdminEmail(session?.user?.email)) redirect("/admin/signin");

  return (
    <div className="min-h-screen">
      <AdminHeader email={session!.user!.email!} />
      {children}
    </div>
  );
}
