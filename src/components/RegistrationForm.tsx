"use client";

import { useState } from "react";
import Link from "next/link";

export type RegisterLabels = {
  email: string;
  name: string;
  furigana: string;
  gender: string;
  genderFemale: string;
  genderMale: string;
  nationality: string;
  prefecture: string;
  phone: string;
  optional: string;
  sessionDate: string;
  sessionPlaceholder: string;
  referral: string;
  referralOptions: string[];
  photoConsent: string;
  photoAgree: string;
  photoDisagree: string;
  choosePlaceholder: string;
  submit: string;
  submitting: string;
  successTitle: string;
  successBody: string;
  backHome: string;
  errorGeneric: string;
};

type SessionOption = { value: string; label: string };

const inputCls =
  "w-full rounded-lg border border-outline-variant/50 bg-surface-container-lowest px-3.5 py-2.5 text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

export function RegistrationForm({
  locale,
  sessions,
  labels,
  homeHref,
}: {
  locale: string;
  sessions: SessionOption[];
  labels: RegisterLabels;
  homeHref: string;
}) {
  const [form, setForm] = useState({
    sessionDate: "",
    email: "",
    fullName: "",
    furigana: "",
    gender: "",
    nationality: "",
    prefecture: "",
    phone: "",
    referralSource: "",
    photoConsent: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, locale }),
      });
      if (!res.ok) {
        setError(labels.errorGeneric);
        setBusy(false);
        return;
      }
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError(labels.errorGeneric);
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-secondary/30 bg-secondary-fixed/30 p-10 text-center">
        <span className="material-symbols-outlined text-5xl text-secondary">
          check_circle
        </span>
        <h2 className="mt-4 font-display text-headline-md text-on-surface">
          {labels.successTitle}
        </h2>
        <p className="mt-3 font-body text-body-md text-on-surface-variant">
          {labels.successBody}
        </p>
        <Link
          href={homeHref}
          className="mt-8 inline-flex rounded-full bg-primary px-8 py-3 font-label-md uppercase tracking-wide text-on-primary hover:bg-primary-fixed-dim hover:text-on-primary-fixed"
        >
          {labels.backHome}
        </Link>
      </div>
    );
  }

  const label = (text: string, required = true) => (
    <span className="mb-1.5 block font-label-md text-on-surface">
      {text}
      {required ? (
        <span className="ml-1 text-error">*</span>
      ) : (
        <span className="ml-1 text-xs text-on-surface-variant">
          （{labels.optional}）
        </span>
      )}
    </span>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        {label(labels.sessionDate)}
        <select
          required
          className={inputCls}
          value={form.sessionDate}
          onChange={set("sessionDate")}
        >
          <option value="" disabled>
            {labels.sessionPlaceholder}
          </option>
          {sessions.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        {label(labels.email)}
        <input type="email" required className={inputCls} value={form.email} onChange={set("email")} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          {label(labels.name)}
          <input required className={inputCls} value={form.fullName} onChange={set("fullName")} />
        </div>
        <div>
          {label(labels.furigana)}
          <input required className={inputCls} value={form.furigana} onChange={set("furigana")} />
        </div>
      </div>

      <div>
        {label(labels.gender)}
        <div className="flex gap-3">
          {[labels.genderFemale, labels.genderMale].map((g) => (
            <label
              key={g}
              className={`flex-1 cursor-pointer rounded-lg border px-4 py-2.5 text-center text-on-surface transition-colors ${
                form.gender === g
                  ? "border-primary bg-primary/10"
                  : "border-outline-variant/50 hover:bg-surface-container"
              }`}
            >
              <input
                type="radio"
                name="gender"
                value={g}
                required
                checked={form.gender === g}
                onChange={set("gender")}
                className="sr-only"
              />
              {g}
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          {label(labels.nationality)}
          <input required className={inputCls} value={form.nationality} onChange={set("nationality")} />
        </div>
        <div>
          {label(labels.prefecture, false)}
          <input className={inputCls} value={form.prefecture} onChange={set("prefecture")} />
        </div>
      </div>

      <div>
        {label(labels.phone, false)}
        <input type="tel" className={inputCls} value={form.phone} onChange={set("phone")} />
      </div>

      <div>
        {label(labels.referral)}
        <select required className={inputCls} value={form.referralSource} onChange={set("referralSource")}>
          <option value="" disabled>
            {labels.choosePlaceholder}
          </option>
          {labels.referralOptions.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>

      <div>
        {label(labels.photoConsent)}
        <div className="flex flex-col gap-2 sm:flex-row">
          {[labels.photoAgree, labels.photoDisagree].map((p) => (
            <label
              key={p}
              className={`flex-1 cursor-pointer rounded-lg border px-4 py-2.5 text-center text-on-surface transition-colors ${
                form.photoConsent === p
                  ? "border-primary bg-primary/10"
                  : "border-outline-variant/50 hover:bg-surface-container"
              }`}
            >
              <input
                type="radio"
                name="photoConsent"
                value={p}
                required
                checked={form.photoConsent === p}
                onChange={set("photoConsent")}
                className="sr-only"
              />
              {p}
            </label>
          ))}
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-error-container px-4 py-2 text-sm text-on-error-container">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-full bg-primary px-8 py-4 font-label-md uppercase tracking-wide text-on-primary shadow-[0_10px_30px_-10px_rgb(124_87_31/0.6)] transition-all hover:bg-primary-fixed-dim hover:text-on-primary-fixed active:translate-y-px disabled:opacity-50"
      >
        {busy ? labels.submitting : labels.submit}
      </button>
    </form>
  );
}
