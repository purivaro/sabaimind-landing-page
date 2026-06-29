import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { articles } from "@/db/schema";
import { PostEditor } from "@/components/admin/PostEditor";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rows = await db
    .select()
    .from(articles)
    .where(eq(articles.id, Number(id)))
    .limit(1);
  const post = rows[0];
  if (!post) notFound();

  return (
    <PostEditor
      post={{
        id: post.id,
        title: post.title,
        slug: post.slug,
        locale: post.locale,
        excerpt: post.excerpt,
        body: post.body,
        coverImage: post.coverImage,
        status: post.status,
      }}
    />
  );
}
