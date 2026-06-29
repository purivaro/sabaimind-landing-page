"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { makeT, type AdminLang } from "@/lib/adminI18n";

export type RegRow = {
  id: number;
  appliedAt: string;
  sessionLabel: string;
  email: string;
  fullName: string;
  furigana: string;
  gender: string;
  nationality: string;
  prefecture: string | null;
  phone: string | null;
  referralSource: string;
  photoConsent: string;
  handled: boolean;
};

export function RegistrationsBoard({
  rows,
  lang,
}: {
  rows: RegRow[];
  lang: AdminLang;
}) {
  const t = makeT(lang);
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<number | null>(
    rows[0]?.id ?? null,
  );
  const [busy, setBusy] = useState(false);

  const selected = rows.find((r) => r.id === selectedId) ?? null;

  async function toggleHandled(r: RegRow) {
    setBusy(true);
    await fetch(`/api/admin/registrations/${r.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ handled: !r.handled }),
    });
    setBusy(false);
    router.refresh();
  }

  async function remove(r: RegRow) {
    if (!confirm(t("reg.confirmDelete"))) return;
    setBusy(true);
    await fetch(`/api/admin/registrations/${r.id}`, { method: "DELETE" });
    setBusy(false);
    setSelectedId(null);
    router.refresh();
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-outline-variant/50 p-12 text-center text-on-surface-variant">
        {t("reg.empty")}
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      {/* List */}
      <div className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest">
        <ul className="max-h-[70vh] divide-y divide-outline-variant/20 overflow-y-auto">
          {rows.map((r) => {
            const isSel = r.id === selectedId;
            return (
              <li key={r.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(r.id)}
                  className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors ${
                    isSel
                      ? "bg-primary/10"
                      : "hover:bg-surface-container"
                  }`}
                >
                  <span
                    className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${
                      r.handled ? "bg-secondary" : "bg-primary"
                    }`}
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="truncate font-medium text-on-surface">
                        {r.fullName}
                      </span>
                      <span className="flex-shrink-0 text-xs text-on-surface-variant">
                        {r.appliedAt}
                      </span>
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-on-surface-variant">
                      {r.sessionLabel}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Detail */}
      <aside className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-5">
        {!selected ? (
          <p className="py-10 text-center text-sm text-on-surface-variant">
            {t("reg.selectPrompt")}
          </p>
        ) : (
          <div>
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-lg text-on-surface">
                  {selected.fullName}
                </h2>
                <p className="text-xs text-on-surface-variant">
                  {selected.furigana}
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  selected.handled
                    ? "bg-secondary-container text-on-secondary-container"
                    : "bg-primary/15 text-primary"
                }`}
              >
                {selected.handled ? t("reg.handledBadge") : t("reg.pendingBadge")}
              </span>
            </div>

            <dl className="divide-y divide-outline-variant/15 text-sm">
              <Row label={t("reg.d.session")} value={selected.sessionLabel} />
              <Row label={t("reg.d.applied")} value={selected.appliedAt} />
              <Row
                label={t("reg.d.email")}
                value={
                  <a
                    href={`mailto:${selected.email}`}
                    className="text-primary hover:underline"
                  >
                    {selected.email}
                  </a>
                }
              />
              <Row label={t("reg.d.phone")} value={selected.phone || "—"} />
              <Row label={t("reg.d.gender")} value={selected.gender} />
              <Row
                label={t("reg.d.nationality")}
                value={selected.nationality}
              />
              <Row
                label={t("reg.d.prefecture")}
                value={selected.prefecture || "—"}
              />
              <Row label={t("reg.d.source")} value={selected.referralSource} />
              <Row label={t("reg.d.photo")} value={selected.photoConsent} />
            </dl>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => toggleHandled(selected)}
                disabled={busy}
                className={`rounded-full px-4 py-2 text-sm font-medium disabled:opacity-50 ${
                  selected.handled
                    ? "border border-outline-variant/50 text-on-surface hover:bg-surface-container"
                    : "bg-primary text-on-primary hover:bg-primary-fixed-dim hover:text-on-primary-fixed"
                }`}
              >
                {selected.handled ? t("reg.markPending") : t("reg.markHandled")}
              </button>
              <button
                type="button"
                onClick={() => remove(selected)}
                disabled={busy}
                className="rounded-full px-4 py-2 text-sm font-medium text-error hover:bg-error-container/40 disabled:opacity-50"
              >
                {t("common.delete")}
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 py-2.5">
      <dt className="w-28 flex-shrink-0 text-on-surface-variant">{label}</dt>
      <dd className="min-w-0 flex-1 break-words text-on-surface">{value}</dd>
    </div>
  );
}
