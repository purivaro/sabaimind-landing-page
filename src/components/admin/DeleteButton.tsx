"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteButton({ id }: { id: number }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    if (!confirm("この記事を削除しますか？")) return;
    setBusy(true);
    const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    setBusy(false);
    if (res.ok) router.refresh();
    else alert("削除に失敗しました。");
  }

  return (
    <button
      onClick={onDelete}
      disabled={busy}
      className="text-on-surface-variant hover:text-error disabled:opacity-50"
      aria-label="削除"
      title="削除"
    >
      <span className="material-symbols-outlined text-[20px]">delete</span>
    </button>
  );
}
