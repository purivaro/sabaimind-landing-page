"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function RegistrationActions({
  id,
  handled,
}: {
  id: number;
  handled: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    await fetch(`/api/admin/registrations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ handled: !handled }),
    });
    setBusy(false);
    router.refresh();
  }

  async function del() {
    if (!confirm("この申し込みを削除しますか？")) return;
    setBusy(true);
    const res = await fetch(`/api/admin/registrations/${id}`, {
      method: "DELETE",
    });
    setBusy(false);
    if (res.ok) router.refresh();
    else alert("削除に失敗しました。");
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={toggle}
        disabled={busy}
        className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors disabled:opacity-50 ${
          handled
            ? "bg-secondary-container text-on-secondary-container"
            : "border border-outline-variant/50 text-on-surface-variant hover:bg-surface-container"
        }`}
      >
        {handled ? "対応済" : "未対応"}
      </button>
      <button
        type="button"
        onClick={del}
        disabled={busy}
        className="text-on-surface-variant hover:text-error disabled:opacity-50"
        title="削除"
      >
        <span className="material-symbols-outlined text-[20px]">delete</span>
      </button>
    </div>
  );
}
