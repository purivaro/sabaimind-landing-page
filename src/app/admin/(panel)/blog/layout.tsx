import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/admin";

export default async function AdminBlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const me = await getCurrentUser();
  if (!me) redirect("/admin/signin");
  if (!me.canWriteBlog) redirect("/admin");
  return <>{children}</>;
}
