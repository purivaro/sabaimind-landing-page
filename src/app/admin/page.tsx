import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/admin";

export default async function AdminHome() {
  const me = await getCurrentUser();
  if (!me) redirect("/admin/signin");
  // Land on the first section this user can access.
  if (me.canWriteBlog) redirect("/admin/blog");
  if (me.canManageRegistrations) redirect("/admin/registrations");
  if (me.canManageCourseDates) redirect("/admin/course-dates");
  if (me.isAdmin) redirect("/admin/users");
  redirect("/admin/signin");
}
