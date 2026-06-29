import { PostEditor } from "@/components/admin/PostEditor";
import { getAdminLang } from "@/lib/adminLang";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  const lang = await getAdminLang();
  return <PostEditor lang={lang} />;
}
