"use client";

import { useRouter } from "next/navigation";

/** Cohort filter as a dropdown (like meisounomori). Navigates via ?session=. */
export function RegistrationFilter({
  options,
  current,
  label,
}: {
  options: { key: string; label: string }[];
  current: string;
  label: string;
}) {
  const router = useRouter();

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-on-surface-variant">{label}</span>
      <select
        value={current}
        onChange={(e) => {
          const v = e.target.value;
          router.push(
            v === "all"
              ? "/admin/registrations"
              : `/admin/registrations?session=${encodeURIComponent(v)}`,
          );
        }}
        className="max-w-[18rem] truncate rounded-full border border-outline-variant/50 bg-surface-container-lowest px-4 py-1.5 text-sm text-on-surface"
      >
        {options.map((o) => (
          <option key={o.key} value={o.key}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
