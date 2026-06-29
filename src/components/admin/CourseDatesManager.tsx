"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CourseDate } from "@/db/schema";

type Draft = {
  date: string;
  labelJa: string;
  labelEn: string;
  sortOrder: string;
  isActive: boolean;
};

const emptyDraft: Draft = {
  date: "",
  labelJa: "",
  labelEn: "",
  sortOrder: "0",
  isActive: true,
};

export function CourseDatesManager({ initial }: { initial: CourseDate[] }) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startCreate() {
    setDraft(emptyDraft);
    setEditingId(null);
    setCreating(true);
    setError(null);
  }
  function startEdit(c: CourseDate) {
    setDraft({
      date: c.date ?? "",
      labelJa: c.labelJa,
      labelEn: c.labelEn ?? "",
      sortOrder: String(c.sortOrder),
      isActive: c.isActive,
    });
    setEditingId(c.id);
    setCreating(false);
    setError(null);
  }
  function cancel() {
    setCreating(false);
    setEditingId(null);
    setError(null);
  }

  async function save() {
    if (!draft.labelJa.trim()) {
      setError("日本語ラベルは必須です");
      return;
    }
    setBusy(true);
    setError(null);
    const payload = {
      date: draft.date.trim() || null,
      labelJa: draft.labelJa.trim(),
      labelEn: draft.labelEn.trim() || null,
      sortOrder: Number(draft.sortOrder) || 0,
      isActive: draft.isActive,
    };
    const url =
      editingId != null
        ? `/api/admin/course-dates/${editingId}`
        : "/api/admin/course-dates";
    const res = await fetch(url, {
      method: editingId != null ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setBusy(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? "保存に失敗しました");
      return;
    }
    cancel();
    router.refresh();
  }

  async function toggleActive(c: CourseDate) {
    await fetch(`/api/admin/course-dates/${c.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !c.isActive }),
    });
    router.refresh();
  }

  async function remove(c: CourseDate) {
    if (!confirm(`「${c.labelJa}」を削除しますか？`)) return;
    await fetch(`/api/admin/course-dates/${c.id}`, { method: "DELETE" });
    router.refresh();
  }

  const formOpen = creating || editingId != null;

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          onClick={startCreate}
          className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-fixed-dim hover:text-on-primary-fixed"
        >
          + 開催日を追加
        </button>
      </div>

      {formOpen && (
        <div className="mb-6 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-5">
          <h2 className="mb-4 text-sm font-semibold text-on-surface">
            {editingId != null ? "開催日を編集" : "新しい開催日"}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="日付 (任意, YYYY-MM-DD)">
              <input
                type="date"
                value={draft.date}
                onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                className="w-full rounded-lg border border-outline-variant/50 bg-surface-container-lowest px-3 py-2 text-sm text-on-surface"
              />
            </Field>
            <Field label="表示順 (小さいほど先)">
              <input
                type="number"
                value={draft.sortOrder}
                onChange={(e) =>
                  setDraft({ ...draft, sortOrder: e.target.value })
                }
                className="w-full rounded-lg border border-outline-variant/50 bg-surface-container-lowest px-3 py-2 text-sm text-on-surface"
              />
            </Field>
            <Field label="ラベル（日本語）*">
              <input
                value={draft.labelJa}
                onChange={(e) => setDraft({ ...draft, labelJa: e.target.value })}
                placeholder="7月7日（火） 夜 19:30〜21:00"
                className="w-full rounded-lg border border-outline-variant/50 bg-surface-container-lowest px-3 py-2 text-sm text-on-surface"
              />
            </Field>
            <Field label="ラベル（English）">
              <input
                value={draft.labelEn}
                onChange={(e) => setDraft({ ...draft, labelEn: e.target.value })}
                placeholder="Tue, Jul 7 · Evening 19:30–21:00"
                className="w-full rounded-lg border border-outline-variant/50 bg-surface-container-lowest px-3 py-2 text-sm text-on-surface"
              />
            </Field>
          </div>
          <label className="mt-4 flex items-center gap-2 text-sm text-on-surface">
            <input
              type="checkbox"
              checked={draft.isActive}
              onChange={(e) =>
                setDraft({ ...draft, isActive: e.target.checked })
              }
            />
            アクティブ（フォームに表示）
          </label>
          {error && <p className="mt-3 text-sm text-error">{error}</p>}
          <div className="mt-4 flex gap-2">
            <button
              onClick={save}
              disabled={busy}
              className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-on-primary disabled:opacity-50"
            >
              {busy ? "保存中…" : "保存"}
            </button>
            <button
              onClick={cancel}
              className="rounded-full border border-outline-variant/50 px-5 py-2 text-sm text-on-surface hover:bg-surface-container"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}

      {initial.length === 0 ? (
        <div className="rounded-xl border border-dashed border-outline-variant/50 p-12 text-center text-on-surface-variant">
          開催日がまだありません。
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-outline-variant/30 bg-surface-container-lowest">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-outline-variant/30 text-on-surface-variant">
              <tr>
                <th className="px-3 py-3 font-medium">順</th>
                <th className="px-3 py-3 font-medium">日付</th>
                <th className="px-3 py-3 font-medium">ラベル</th>
                <th className="px-3 py-3 font-medium">状態</th>
                <th className="px-3 py-3">
                  <span className="sr-only">操作</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {initial.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-outline-variant/20 align-top last:border-0"
                >
                  <td className="px-3 py-3 text-on-surface-variant">
                    {c.sortOrder}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-on-surface-variant">
                    {c.date ?? "—"}
                  </td>
                  <td className="px-3 py-3">
                    <div className="font-medium text-on-surface">{c.labelJa}</div>
                    {c.labelEn && (
                      <div className="text-xs text-on-surface-variant">
                        {c.labelEn}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <button
                      onClick={() => toggleActive(c)}
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        c.isActive
                          ? "bg-primary/15 text-primary"
                          : "bg-surface-container text-on-surface-variant"
                      }`}
                    >
                      {c.isActive ? "アクティブ" : "非表示"}
                    </button>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-right">
                    <button
                      onClick={() => startEdit(c)}
                      className="text-primary hover:underline"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => remove(c)}
                      className="ml-3 text-error hover:underline"
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-on-surface-variant">
        {label}
      </span>
      {children}
    </label>
  );
}
