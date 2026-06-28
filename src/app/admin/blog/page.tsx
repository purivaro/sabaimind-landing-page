import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { articles, authors } from "@/db/schema";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

function fmt(d: Date | null) {
  return d ? new Date(d).toISOString().slice(0, 10) : "—";
}

export default async function AdminBlogList() {
  const posts = await db
    .select({
      id: articles.id,
      slug: articles.slug,
      locale: articles.locale,
      title: articles.title,
      status: articles.status,
      updatedAt: articles.updatedAt,
      authorName: authors.name,
    })
    .from(articles)
    .leftJoin(authors, eq(articles.authorId, authors.id))
    .orderBy(desc(articles.updatedAt));

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="mb-6 text-xl font-semibold text-on-surface">記事一覧</h1>

      {posts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-outline-variant/50 p-12 text-center text-on-surface-variant">
          まだ記事がありません。
          <Link href="/admin/blog/new" className="ml-2 text-primary underline">
            最初の記事を書く
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-outline-variant/30 text-on-surface-variant">
              <tr>
                <th className="px-4 py-3 font-medium">タイトル</th>
                <th className="px-4 py-3 font-medium">言語</th>
                <th className="px-4 py-3 font-medium">状態</th>
                <th className="px-4 py-3 font-medium">更新日</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-outline-variant/20 last:border-0"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/blog/${p.id}`}
                      className="font-medium text-on-surface hover:text-primary"
                    >
                      {p.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 uppercase text-on-surface-variant">
                    {p.locale}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        p.status === "published"
                          ? "bg-secondary-container text-on-secondary-container"
                          : "bg-surface-container-high text-on-surface-variant"
                      }`}
                    >
                      {p.status === "published" ? "公開中" : "下書き"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-on-surface-variant">
                    {fmt(p.updatedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      {p.status === "published" && (
                        <Link
                          href={`/${p.locale}/blog/${p.slug}`}
                          target="_blank"
                          className="text-on-surface-variant hover:text-primary"
                          title="表示"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            open_in_new
                          </span>
                        </Link>
                      )}
                      <DeleteButton id={p.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
