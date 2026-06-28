import { redirect } from "next/navigation";
import { auth, isAdminEmail } from "@/auth";

export default async function AdminHome() {
  const session = await auth();
  if (!isAdminEmail(session?.user?.email)) redirect("/admin/signin");
  redirect("/admin/blog");
}
