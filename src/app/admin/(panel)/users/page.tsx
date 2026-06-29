import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { users, authors } from "@/db/schema";
import { getCurrentUser } from "@/lib/admin";
import { UsersManager } from "@/components/admin/UsersManager";
import { getAdminLang } from "@/lib/adminLang";
import { makeT } from "@/lib/adminI18n";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const me = await getCurrentUser();
  const lang = await getAdminLang();
  const t = makeT(lang);
  const rows = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      authorId: users.authorId,
      isActive: users.isActive,
      isAdmin: users.isAdmin,
      blogRole: users.blogRole,
      canManageRegistrations: users.canManageRegistrations,
      canManageCourseDates: users.canManageCourseDates,
      bylineName: authors.name,
      bylineBio: authors.bio,
    })
    .from(users)
    .leftJoin(authors, eq(users.authorId, authors.id))
    .orderBy(asc(users.id));

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-6">
        <p className="text-sm text-on-surface-variant">{t("um.subtitle")}</p>
      </div>
      <UsersManager
        initial={rows}
        currentUserId={me?.id ?? null}
        lang={lang}
      />
    </main>
  );
}
