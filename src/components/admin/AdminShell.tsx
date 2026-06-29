"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { Me } from "@/lib/admin";
import { makeT, type AdminLang } from "@/lib/adminI18n";
import { LangSwitcher } from "./LangSwitcher";

type Section = "blog" | "registrations" | "course-dates" | "users";

type NavItem = {
  section: Section;
  href: string;
  icon: string;
  group: "content" | "course" | "admin";
};

function activeFromPath(p: string): Section | null {
  if (p.startsWith("/admin/blog")) return "blog";
  if (p.startsWith("/admin/registrations")) return "registrations";
  if (p.startsWith("/admin/course-dates")) return "course-dates";
  if (p.startsWith("/admin/users")) return "users";
  return null;
}

const GROUP_ORDER: NavItem["group"][] = ["content", "course", "admin"];

export function AdminShell({
  me,
  lang,
  signOutAction,
  children,
}: {
  me: Me;
  lang: AdminLang;
  signOutAction: () => Promise<void>;
  children: React.ReactNode;
}) {
  const t = makeT(lang);
  const pathname = usePathname();
  const active = activeFromPath(pathname);
  const [open, setOpen] = useState(false);

  const nav: NavItem[] = [
    me.canWriteBlog && {
      section: "blog",
      href: "/admin/blog",
      icon: "article",
      group: "content",
    },
    me.canManageRegistrations && {
      section: "registrations",
      href: "/admin/registrations",
      icon: "assignment",
      group: "course",
    },
    me.canManageCourseDates && {
      section: "course-dates",
      href: "/admin/course-dates",
      icon: "calendar_month",
      group: "course",
    },
    me.isAdmin && {
      section: "users",
      href: "/admin/users",
      icon: "manage_accounts",
      group: "admin",
    },
  ].filter(Boolean) as NavItem[];

  const roleLabel = me.isAdmin
    ? t("role.admin")
    : me.blogRole !== "none"
      ? t(`role.${me.blogRole}`)
      : t("role.member");

  const currentTitle = active ? t(`title.${active.replace("-", "")}`) : "";
  const initial = (me.name || me.email || "?").trim().charAt(0).toUpperCase();

  const sidebar = (
    <div className="flex h-full flex-col bg-[#2b2620] text-[#e9e1d4]">
      <div className="flex items-center gap-3 px-5 pb-4 pt-5">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary font-display text-lg font-bold text-on-primary">
          瞑
        </div>
        <div className="min-w-0">
          <strong className="block font-display text-[0.98rem] leading-tight">
            {t("brand.title")}
          </strong>
          <span className="block text-[0.68rem] uppercase tracking-[0.12em] text-[#b4a892]">
            {t("brand.sub")}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="ml-auto rounded-lg p-1 text-[#b4a892] hover:text-white lg:hidden"
          aria-label="close"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2">
        {GROUP_ORDER.map((g) => {
          const items = nav.filter((n) => n.group === g);
          if (!items.length) return null;
          return (
            <div key={g} className="mb-1">
              <p className="mx-3 mb-1 mt-3 text-[0.66rem] uppercase tracking-[0.14em] text-[#8d8169]">
                {t(`group.${g}`)}
              </p>
              {items.map((n) => {
                const isActive = active === n.section;
                return (
                  <Link
                    key={n.section}
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-primary/20 text-white shadow-[inset_3px_0_0_var(--color-primary-fixed-dim)]"
                        : "text-[#dcd3c2] hover:bg-white/[0.07] hover:text-white"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {n.icon}
                    </span>
                    <span>{t(`nav.${n.section.replace("-", "")}`)}</span>
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      <div className="border-t border-white/10 px-3 pb-4 pt-2">
        <a
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#b4a892] hover:bg-white/[0.07] hover:text-white"
        >
          <span className="material-symbols-outlined text-[18px]">
            open_in_new
          </span>
          <span>{t("nav.viewsite")}</span>
        </a>
        <div className="mt-2 flex items-center gap-2.5 rounded-xl bg-black/20 px-2.5 py-2">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary font-bold text-on-primary">
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <strong className="block truncate text-[0.84rem]">
              {me.name || me.email}
            </strong>
            <span className="block text-[0.7rem] text-[#b4a892]">
              {roleLabel}
            </span>
          </div>
          <form action={signOutAction}>
            <button
              type="submit"
              title={t("common.logout")}
              className="rounded-lg p-1.5 text-[#b4a892] hover:bg-white/10 hover:text-white"
            >
              <span className="material-symbols-outlined text-[18px]">
                logout
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-surface-container-low">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-[260px] flex-shrink-0 lg:block">
        {sidebar}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-[260px] transition-transform lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebar}
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-outline-variant/30 bg-surface-container-lowest/90 px-4 backdrop-blur sm:px-6">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-lg p-1 text-on-surface lg:hidden"
            aria-label="menu"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>
          <h1 className="font-display text-lg font-bold text-on-surface">
            {currentTitle}
          </h1>
          <div className="ml-auto">
            <LangSwitcher lang={lang} />
          </div>
        </header>

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
