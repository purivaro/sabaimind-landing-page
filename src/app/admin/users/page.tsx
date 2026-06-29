import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { users, authors } from "@/db/schema";
import { getCurrentUser } from "@/lib/admin";
import { UsersManager } from "@/components/admin/UsersManager";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const me = await getCurrentUser();
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
        <h1 className="text-xl font-semibold text-on-surface">ユーザー管理</h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          管理画面にアクセスできるユーザーと権限を管理します。ログインは Google
          アカウントのみ。招待したメールアドレスで初回ログイン時にアクセスが有効になります。
        </p>
      </div>
      <UsersManager initial={rows} currentUserId={me?.id ?? null} />
    </main>
  );
}
