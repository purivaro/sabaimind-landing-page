"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { makeT, type AdminLang } from "@/lib/adminI18n";

export type UserRow = {
  id: number;
  email: string;
  name: string | null;
  authorId: number | null;
  isActive: boolean;
  isAdmin: boolean;
  blogRole: string;
  canManageRegistrations: boolean;
  canManageCourseDates: boolean;
  bylineName: string | null;
  bylineBio: string | null;
};

type Draft = {
  email: string;
  bylineName: string;
  bylineBio: string;
  isActive: boolean;
  isAdmin: boolean;
  blogRole: string;
  canManageRegistrations: boolean;
  canManageCourseDates: boolean;
};

const emptyDraft: Draft = {
  email: "",
  bylineName: "",
  bylineBio: "",
  isActive: true,
  isAdmin: false,
  blogRole: "none",
  canManageRegistrations: false,
  canManageCourseDates: false,
};

const BLOG_ROLE_VALUES = ["none", "writer", "editor", "director"] as const;

export function UsersManager({
  initial,
  currentUserId,
  lang,
}: {
  initial: UserRow[];
  currentUserId: number | null;
  lang: AdminLang;
}) {
  const t = makeT(lang);
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
  function startEdit(u: UserRow) {
    setDraft({
      email: u.email,
      bylineName: u.bylineName ?? u.name ?? "",
      bylineBio: u.bylineBio ?? "",
      isActive: u.isActive,
      isAdmin: u.isAdmin,
      blogRole: u.blogRole,
      canManageRegistrations: u.canManageRegistrations,
      canManageCourseDates: u.canManageCourseDates,
    });
    setEditingId(u.id);
    setCreating(false);
    setError(null);
  }
  function cancel() {
    setCreating(false);
    setEditingId(null);
    setError(null);
  }

  async function save() {
    if (!draft.email.trim() || !draft.email.includes("@")) {
      setError(t("um.invalidEmail"));
      return;
    }
    setBusy(true);
    setError(null);
    const payload = {
      email: draft.email.trim().toLowerCase(),
      bylineName: draft.bylineName.trim() || null,
      bylineBio: draft.bylineBio.trim() || null,
      isActive: draft.isActive,
      isAdmin: draft.isAdmin,
      blogRole: draft.blogRole,
      canManageRegistrations: draft.canManageRegistrations,
      canManageCourseDates: draft.canManageCourseDates,
    };
    const url =
      editingId != null ? `/api/admin/users/${editingId}` : "/api/admin/users";
    const res = await fetch(url, {
      method: editingId != null ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setBusy(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? t("common.saveFailed"));
      return;
    }
    cancel();
    router.refresh();
  }

  async function remove(u: UserRow) {
    if (!confirm(t("um.confirmDelete", { email: u.email }))) return;
    const res = await fetch(`/api/admin/users/${u.id}`, { method: "DELETE" });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      alert(j.error ?? t("common.saveFailed"));
      return;
    }
    router.refresh();
  }

  const formOpen = creating || editingId != null;
  const editingSelf = editingId != null && editingId === currentUserId;

  function permSummary(u: UserRow): string {
    if (u.isAdmin) return t("um.permFull");
    const parts: string[] = [];
    if (u.blogRole !== "none") parts.push(t(`role.${u.blogRole}`));
    if (u.canManageRegistrations) parts.push(t("nav.registrations"));
    if (u.canManageCourseDates) parts.push(t("nav.coursedates"));
    return parts.length ? parts.join(" · ") : t("um.permNone");
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          onClick={startCreate}
          className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-fixed-dim hover:text-on-primary-fixed"
        >
          + {t("um.invite")}
        </button>
      </div>

      {formOpen && (
        <div className="mb-6 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-5">
          <h2 className="mb-4 text-sm font-semibold text-on-surface">
            {editingId != null ? t("um.edit") : t("um.new")}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t("um.f.email")}>
              <input
                type="email"
                value={draft.email}
                onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                placeholder="name@example.com"
                className="w-full rounded-lg border border-outline-variant/50 bg-surface-container-lowest px-3 py-2 text-sm text-on-surface"
              />
            </Field>
            <Field label={t("um.f.byline")}>
              <input
                value={draft.bylineName}
                onChange={(e) =>
                  setDraft({ ...draft, bylineName: e.target.value })
                }
                placeholder={t("um.f.byline")}
                className="w-full rounded-lg border border-outline-variant/50 bg-surface-container-lowest px-3 py-2 text-sm text-on-surface"
              />
            </Field>
          </div>
          <div className="mt-4">
            <Field label={t("um.f.bio")}>
              <textarea
                value={draft.bylineBio}
                onChange={(e) =>
                  setDraft({ ...draft, bylineBio: e.target.value })
                }
                rows={2}
                className="w-full rounded-lg border border-outline-variant/50 bg-surface-container-lowest px-3 py-2 text-sm text-on-surface"
              />
            </Field>
          </div>

          <fieldset className="mt-5 rounded-lg border border-outline-variant/30 p-4">
            <legend className="px-1 text-xs font-medium text-on-surface-variant">
              {t("um.perm")}
            </legend>
            <label className="flex items-center gap-2 text-sm text-on-surface">
              <input
                type="checkbox"
                checked={draft.isAdmin}
                disabled={editingSelf}
                onChange={(e) =>
                  setDraft({ ...draft, isAdmin: e.target.checked })
                }
              />
              {t("um.admin")}
            </label>
            {!draft.isAdmin && (
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="block text-sm text-on-surface">
                  <span className="mb-1 block text-xs text-on-surface-variant">
                    {t("um.blogRole")}
                  </span>
                  <select
                    value={draft.blogRole}
                    onChange={(e) =>
                      setDraft({ ...draft, blogRole: e.target.value })
                    }
                    className="w-full rounded-lg border border-outline-variant/50 bg-surface-container-lowest px-3 py-2 text-sm text-on-surface"
                  >
                    {BLOG_ROLE_VALUES.map((v) => (
                      <option key={v} value={v}>
                        {t(`role.${v}`)}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="flex flex-col justify-center gap-2">
                  <label className="flex items-center gap-2 text-sm text-on-surface">
                    <input
                      type="checkbox"
                      checked={draft.canManageRegistrations}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          canManageRegistrations: e.target.checked,
                        })
                      }
                    />
                    {t("um.canReg")}
                  </label>
                  <label className="flex items-center gap-2 text-sm text-on-surface">
                    <input
                      type="checkbox"
                      checked={draft.canManageCourseDates}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          canManageCourseDates: e.target.checked,
                        })
                      }
                    />
                    {t("um.canCd")}
                  </label>
                </div>
              </div>
            )}
            <label className="mt-4 flex items-center gap-2 text-sm text-on-surface">
              <input
                type="checkbox"
                checked={draft.isActive}
                disabled={editingSelf}
                onChange={(e) =>
                  setDraft({ ...draft, isActive: e.target.checked })
                }
              />
              {t("um.activeLogin")}
            </label>
          </fieldset>

          {error && <p className="mt-3 text-sm text-error">{error}</p>}
          <div className="mt-4 flex gap-2">
            <button
              onClick={save}
              disabled={busy}
              className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-on-primary disabled:opacity-50"
            >
              {busy ? t("common.saving") : t("common.save")}
            </button>
            <button
              onClick={cancel}
              className="rounded-full border border-outline-variant/50 px-5 py-2 text-sm text-on-surface hover:bg-surface-container"
            >
              {t("common.cancel")}
            </button>
          </div>
        </div>
      )}

      {initial.length === 0 ? (
        <div className="rounded-xl border border-dashed border-outline-variant/50 p-12 text-center text-on-surface-variant">
          {t("um.empty")}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-outline-variant/30 bg-surface-container-lowest">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-outline-variant/30 text-on-surface-variant">
              <tr>
                <th className="px-3 py-3 font-medium">{t("um.th.email")}</th>
                <th className="px-3 py-3 font-medium">{t("um.th.name")}</th>
                <th className="px-3 py-3 font-medium">{t("um.th.perm")}</th>
                <th className="px-3 py-3 font-medium">{t("um.th.status")}</th>
                <th className="px-3 py-3">
                  <span className="sr-only">—</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {initial.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-outline-variant/20 align-top last:border-0"
                >
                  <td className="px-3 py-3 text-on-surface">
                    {u.email}
                    {u.id === currentUserId && (
                      <span className="ml-2 rounded-full bg-primary/15 px-2 py-0.5 text-xs text-primary">
                        {t("um.you")}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-on-surface-variant">
                    {u.bylineName ?? u.name ?? "—"}
                  </td>
                  <td className="px-3 py-3 text-on-surface-variant">
                    {permSummary(u)}
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        u.isActive
                          ? "bg-primary/15 text-primary"
                          : "bg-surface-container text-on-surface-variant"
                      }`}
                    >
                      {u.isActive ? t("um.active") : t("um.inactive")}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-right">
                    <button
                      onClick={() => startEdit(u)}
                      className="text-primary hover:underline"
                    >
                      {t("common.edit")}
                    </button>
                    {u.id !== currentUserId && (
                      <button
                        onClick={() => remove(u)}
                        className="ml-3 text-error hover:underline"
                      >
                        {t("common.delete")}
                      </button>
                    )}
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
