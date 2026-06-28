"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export type EditorPost = {
  id: number;
  title: string;
  slug: string;
  locale: string;
  excerpt: string | null;
  body: string;
  coverImage: string | null;
  status: string;
};

export function PostEditor({ post }: { post?: EditorPost }) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [locale, setLocale] = useState(post?.locale ?? "ja");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [body, setBody] = useState(post?.body ?? "");
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? "");
  const [idea, setIdea] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const isEdit = !!post;

  async function uploadImage(file: File): Promise<string | null> {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Upload failed");
      return null;
    }
    return data.url as string;
  }

  async function onCoverSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError("");
    const url = await uploadImage(file);
    if (url) setCoverImage(url);
    setBusy(false);
    e.target.value = "";
  }

  async function onBodyImageSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError("");
    const url = await uploadImage(file);
    if (url) setBody((b) => `${b}\n\n![](${url})\n`);
    setBusy(false);
    e.target.value = "";
  }

  async function save(status: "draft" | "published") {
    if (!title.trim() || !body.trim()) {
      setError("タイトルと本文は必須です。");
      return;
    }
    setBusy(true);
    setError("");
    const payload = { title, slug, locale, excerpt, body, coverImage, status };
    const res = await fetch(
      isEdit ? `/api/admin/posts/${post!.id}` : "/api/admin/posts",
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error ?? "保存に失敗しました。");
      return;
    }
    router.push("/admin/blog");
    router.refresh();
  }

  async function aiDraft() {
    if (!idea.trim()) {
      setError("AI に渡すアイデアを入力してください。");
      return;
    }
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/ai/draft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea, locale }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error ?? "AI 生成に失敗しました。");
      return;
    }
    setTitle(data.title ?? "");
    setExcerpt(data.excerpt ?? "");
    setBody(data.body ?? "");
  }

  async function aiImage() {
    const subject = (title || idea).trim();
    if (!subject) {
      setError("画像生成にはタイトルかアイデアが必要です。");
      return;
    }
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/ai/image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: `Blog cover image for: ${subject}. Calm, serene, professional photography, soft natural light.`,
      }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error ?? "画像生成に失敗しました。");
      return;
    }
    setCoverImage(data.url);
  }

  const inputCls =
    "w-full rounded-lg border border-outline-variant/50 bg-surface-container-lowest px-3 py-2 text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-on-surface">
          {isEdit ? "記事を編集" : "新しい記事"}
        </h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => save("draft")}
            disabled={busy}
            className="rounded-full border border-outline-variant/50 px-5 py-2 text-sm font-medium text-on-surface hover:bg-surface-container disabled:opacity-50"
          >
            下書き保存
          </button>
          <button
            type="button"
            onClick={() => save("published")}
            disabled={busy}
            className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-on-primary hover:bg-primary-fixed-dim hover:text-on-primary-fixed disabled:opacity-50"
          >
            公開する
          </button>
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-error-container px-4 py-2 text-sm text-on-error-container">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main */}
        <div className="space-y-4">
          <input
            className={`${inputCls} text-lg font-semibold`}
            placeholder="タイトル"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <input
                className={inputCls}
                placeholder="スラッグ（URL）任意"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
            <select
              className={inputCls}
              aria-label="言語"
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
            >
              <option value="ja">日本語 (ja)</option>
              <option value="en">English (en)</option>
            </select>
          </div>

          <textarea
            className={inputCls}
            placeholder="抜粋（一覧・SNS用）任意"
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-on-surface-variant">
                本文（Markdown）
              </label>
              <textarea
                className={`${inputCls} font-mono text-sm`}
                rows={22}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="# 見出し&#10;&#10;本文を Markdown で書きます。"
              />
              <label className="mt-2 inline-flex cursor-pointer items-center gap-2 text-sm text-primary">
                <span className="material-symbols-outlined text-[18px]">image</span>
                本文に画像を挿入
                <input type="file" accept="image/*" className="hidden" onChange={onBodyImageSelected} />
              </label>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-on-surface-variant">
                プレビュー
              </label>
              <div className="prose prose-zinc h-[36rem] max-w-none overflow-y-auto rounded-lg border border-outline-variant/40 bg-surface-container-lowest p-4">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {body || "_プレビューがここに表示されます_"}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
            <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-on-surface">
              <span className="material-symbols-outlined text-[18px] text-primary">
                auto_awesome
              </span>
              AI アシスト
            </h3>
            <textarea
              className={`${inputCls} text-sm`}
              rows={3}
              placeholder="記事のアイデアを入力（例：瞑想を始める人へのアドバイス）"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
            />
            <div className="mt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={aiDraft}
                disabled={busy}
                className="flex items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-fixed-dim hover:text-on-primary-fixed disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">edit_note</span>
                AI で下書きを生成
              </button>
              <button
                type="button"
                onClick={aiImage}
                disabled={busy}
                className="flex items-center justify-center gap-1.5 rounded-full border border-primary/50 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">image</span>
                AI でカバー画像を生成
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-4">
            <h3 className="mb-3 text-sm font-semibold text-on-surface">カバー画像</h3>
            {coverImage ? (
              <div className="mb-3 overflow-hidden rounded-lg">
                <Image
                  src={coverImage}
                  alt="cover"
                  width={320}
                  height={180}
                  className="h-auto w-full object-cover"
                />
              </div>
            ) : (
              <div className="mb-3 flex aspect-video items-center justify-center rounded-lg bg-surface-container text-on-surface-variant">
                <span className="material-symbols-outlined">add_photo_alternate</span>
              </div>
            )}
            <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-primary">
              <span className="material-symbols-outlined text-[18px]">upload</span>
              アップロード
              <input type="file" accept="image/*" className="hidden" onChange={onCoverSelected} />
            </label>
            {coverImage && (
              <button
                onClick={() => setCoverImage("")}
                className="ml-3 text-sm text-on-surface-variant hover:text-error"
              >
                削除
              </button>
            )}
          </div>

          {isEdit && (
            <p className="text-xs text-on-surface-variant">
              ステータス: {post!.status === "published" ? "公開中" : "下書き"}
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
