import { redirect } from "next/navigation";
import { signOut } from "@/auth";
import { getCurrentUser } from "@/lib/admin";
import { getAdminLang } from "@/lib/adminLang";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const me = await getCurrentUser();
  if (!me) redirect("/admin/signin");
  const lang = await getAdminLang();

  async function doSignOut() {
    "use server";
    await signOut({ redirectTo: "/admin/signin" });
  }

  return (
    <AdminShell me={me} lang={lang} signOutAction={doSignOut}>
      {children}
    </AdminShell>
  );
}
