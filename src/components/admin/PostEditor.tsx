"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { makeT, type AdminLang } from "@/lib/adminI18n";

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

export function PostEditor({
  post,
  lang = "ja",
}: {
  post?: EditorPost;
  lang?: AdminLang;
}) {
  const t = makeT(lang);
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
      setError(data.error ?? t("be.uploadFailed"));
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
      setError(t("be.errRequired"));
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
      setError(data.error ?? t("common.saveFailed"));
      return;
    }
    router.push("/admin/blog");
    router.refresh();
  }

  async function aiDraft() {
    if (!idea.trim()) {
      setError(t("be.errIdea"));
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
      setError(data.error ?? t("be.errAiDraft"));
      return;
    }
    setTitle(data.title ?? "");
    setExcerpt(data.excerpt ?? "");
    setBody(data.body ?? "");
  }

  async function aiImage() {
    const subject = (title || idea).trim();
    if (!subject) {
      setError(t("be.errAiImageNeed"));
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
      setError(data.error ?? t("be.errAiImage"));
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
          {isEdit ? t("be.editTitle") : t("be.newTitle")}
        </h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => save("draft")}
            disabled={busy}
            className="rounded-full border border-outline-variant/50 px-5 py-2 text-sm font-medium text-on-surface hover:bg-surface-container disabled:opacity-50"
          >
            {t("be.saveDraft")}
          </button>
          <button
            type="button"
            onClick={() => save("published")}
            disabled={busy}
            className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-on-primary hover:bg-primary-fixed-dim hover:text-on-primary-fixed disabled:opacity-50"
          >
            {t("be.publish")}
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
            placeholder={t("be.phTitle")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <input
                className={inputCls}
                placeholder={t("be.phSlug")}
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
            <select
              className={inputCls}
              aria-label={t("be.lang")}
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
            >
              <option value="ja">日本語 (ja)</option>
              <option value="en">English (en)</option>
            </select>
          </div>

          <textarea
            className={inputCls}
            placeholder={t("be.phExcerpt")}
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-on-surface-variant">
                {t("be.bodyLabel")}
              </label>
              <textarea
                className={`${inputCls} font-mono text-sm`}
                rows={22}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={t("be.phBody")}
              />
              <label className="mt-2 inline-flex cursor-pointer items-center gap-2 text-sm text-primary">
                <span className="material-symbols-outlined text-[18px]">image</span>
                {t("be.insertImage")}
                <input type="file" accept="image/*" className="hidden" onChange={onBodyImageSelected} />
              </label>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-on-surface-variant">
                {t("be.preview")}
              </label>
              <div className="prose prose-zinc h-[36rem] max-w-none overflow-y-auto rounded-lg border border-outline-variant/40 bg-surface-container-lowest p-4">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {body || t("be.previewPlaceholder")}
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
              {t("be.aiAssist")}
            </h3>
            <textarea
              className={`${inputCls} text-sm`}
              rows={3}
              placeholder={t("be.phIdea")}
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
                {t("be.aiDraft")}
              </button>
              <button
                type="button"
                onClick={aiImage}
                disabled={busy}
                className="flex items-center justify-center gap-1.5 rounded-full border border-primary/50 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">image</span>
                {t("be.aiImage")}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-4">
            <h3 className="mb-3 text-sm font-semibold text-on-surface">{t("be.cover")}</h3>
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
              {t("be.upload")}
              <input type="file" accept="image/*" className="hidden" onChange={onCoverSelected} />
            </label>
            {coverImage && (
              <button
                type="button"
                onClick={() => setCoverImage("")}
                className="ml-3 text-sm text-on-surface-variant hover:text-error"
              >
                {t("common.delete")}
              </button>
            )}
          </div>

          {isEdit && (
            <p className="text-xs text-on-surface-variant">
              {t("be.statusLabel")}:{" "}
              {post!.status === "published"
                ? t("status.published")
                : t("status.draft")}
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
