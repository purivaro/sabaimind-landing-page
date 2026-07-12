# Maintaining sabaimind.or.jp

This is the single source of truth for understanding and maintaining this website.
Read it fully before making changes. It is written for both human teammates and AI
coding agents (Codex / Claude).

> **Hard rule for AI agents:** This repo runs **Next.js 16 (App Router)**, which has
> breaking changes vs. older Next.js. When unsure about a Next.js API, read the bundled
> docs in `node_modules/next/dist/docs/` instead of guessing. See also `AGENTS.md`.

---

## 1. What this site is

- **Owner:** NPO法人サバーイマインド (Sabai Mind NPO) — a Japanese non‑profit offering Thai‑style meditation
  and mindfulness to a Japanese audience.
- **Live site:** https://sabaimind.or.jp
- **Audience / languages:** Public site is **Japanese (default) + English**. (Thai was
  dropped from the public site; some `.th.md` content files remain but are not built.)
- **Two parts:**
  1. **Public marketing site** (`/[locale]/...`) — home, about, activities, news, videos,
     blog, contact, and an event **registration** form.
  2. **Admin panel** (`/admin`) — blog CMS, event registrations, course dates (cohorts),
     and user management. Admin UI is trilingual: **ja / th / en**.

---

## 2. Tech stack

| Area        | Choice |
|-------------|--------|
| Framework   | Next.js 16 (App Router, Turbopack), React 19, TypeScript |
| Styling     | Tailwind CSS v4 (theme tokens in `src/app/globals.css`), Material Symbols icons |
| Fonts       | Noto Serif JP (display) + Noto Sans JP (body) via `next/font` |
| Content     | Markdown files in `content/` parsed with `gray-matter` |
| Database    | **Neon Postgres** via **Drizzle ORM** (`drizzle-orm/neon-http`) |
| Auth        | Auth.js / NextAuth v5 (Google OAuth only) |
| Images      | `public/images/...` (static) + **Vercel Blob** (uploaded blog images) |
| Email       | Resend (registration confirmation + team notification) |
| AI features | Anthropic Claude (blog draft) + OpenAI (cover image generation) |
| Hosting     | **Vercel** (auto‑deploy). DNS on **Cloudflare** (proxied → Vercel). |

---

## 3. Repo, hosting & deploy flow

- **Repo:** `git@github.com:purivaro/sabaimind-landing-page.git`, default branch **`main`**.
- **Deploy:** Vercel is connected to the GitHub repo.
  - **Push to `main` → production deploy** (aliased to `sabaimind.or.jp`), ~1–3 min.
  - **Open a PR / push any branch → a Preview Deployment** with its own URL (great for
    review before going live). Contributors never need to log into Vercel.
- **You do NOT need to own Vercel or Cloudflare to edit the site** — only GitHub repo
  access. Cloudflare is DNS only.
- Vercel project: `aunpuri-1208s-projects/sabaimind-landing-page`. CLI fallback if a push
  doesn't deploy: `npx vercel deploy --prod --scope aunpuri-1208s-projects`.
- `.vercelignore` excludes source assets (`assets/`, `screenshots/`, scratch `.md`).

---

## 4. Local setup

```bash
git clone git@github.com:purivaro/sabaimind-landing-page.git
cd sabaimind-landing-page
npm install
cp .env.example .env.local      # then fill in real values (get them from the owner)
npm run dev                      # http://localhost:3000
```

Scripts (`package.json`):

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build (also typechecks) — run before pushing |
| `npm run start` | Serve the production build |
| `npm run db:generate` | Generate a Drizzle migration from `src/db/schema.ts` |
| `npm run db:migrate` | Apply pending migrations to the DB in `DATABASE_URL` |
| `npm run db:push` | Push schema directly (prefer generate+migrate) |
| `npm run db:studio` | Drizzle Studio (browse the DB) |

> The DB connection is **lazy** (`src/db/index.ts`), so `npm run build` is green even
> without `DATABASE_URL`. UI‑only edits don't strictly need a database.

---

## 5. Environment variables

Set these in `.env.local` (local) **and** Vercel → Settings → Environment Variables
(production). Never commit secrets — `.env.local` is gitignored.

| Variable | Required | What it does |
|----------|----------|--------------|
| `DATABASE_URL` | yes (DB features) | Neon pooled Postgres connection string |
| `AUTH_SECRET` | yes (admin) | NextAuth session secret (`npx auth secret`) |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | yes (admin) | Google OAuth client |
| `ADMIN_EMAILS` | yes (admin) | Comma‑separated **super‑admin bootstrap** emails (see §9) |
| `BLOB_READ_WRITE_TOKEN` | for image upload | Vercel Blob store token |
| `ANTHROPIC_API_KEY` | for AI draft | Claude API key |
| `OPENAI_API_KEY` | for AI cover image | OpenAI API key |
| `RESEND_API_KEY` | for emails | Resend API key (if unset, registrations still save, no email) |
| `RESEND_FROM_EMAIL` | for emails | Verified sender, e.g. `Sabai Mind <noreply@sabaimind.or.jp>` |
| `REGISTRATION_TEAM_EMAILS` | optional | Extra fixed team recipients (merged with DB notify users, §10) |

Google OAuth must list both redirect URIs:
`http://localhost:3000/api/auth/callback/google` and
`https://sabaimind.or.jp/api/auth/callback/google`.

---

## 6. Project structure

```
src/
├── app/
│   ├── layout.tsx                      # root (pass-through)
│   ├── [locale]/                       # PUBLIC site (locale = ja | en)
│   │   ├── layout.tsx                  # html/body + Nav + Footer
│   │   ├── page.tsx                    # home
│   │   ├── about|activities|news|videos|blog/{page,[slug]}.tsx
│   │   ├── contact/page.tsx
│   │   └── register/page.tsx           # event registration form
│   ├── admin/                          # ADMIN panel
│   │   ├── layout.tsx                  # html/body (loads Material Symbols)
│   │   ├── page.tsx                    # entry: redirect to first allowed section / no-access page
│   │   ├── signin/page.tsx             # Google sign-in
│   │   └── (panel)/                    # route group: the sidebar shell
│   │       ├── layout.tsx              # renders AdminShell (sidebar + topbar)
│   │       ├── blog/{page,new,[id]}.tsx
│   │       ├── registrations/page.tsx
│   │       ├── course-dates/page.tsx
│   │       └── users/page.tsx
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       ├── register/route.ts           # public: submit a registration + emails
│       └── admin/{posts,users,course-dates,registrations,upload,ai}/...  # admin APIs
├── components/         # Nav, Footer, RegistrationForm, admin/* (AdminShell, *Manager, ...)
├── db/                 # index.ts (Drizzle client) + schema.ts (tables)
├── i18n/               # config.ts (public locales) + dictionaries.ts (ja/en UI strings)
├── lib/                # content.ts, courseDates.ts, email.ts, admin.ts, adminI18n.ts, ...
└── middleware.ts       # "/" → "/ja"; excludes /admin, /api, /login

content/                # Markdown content (per section, per locale)
├── about|activities|news|videos/<slug>.<locale>.md
└── _template/{activity,news,video}.md   # copy these when adding content

public/images/...       # static images referenced by content frontmatter
drizzle/                # generated SQL migrations + meta (committed)
```

---

## 7. Editing content (the most common task)

Public **about / activities / news / videos** pages are **Markdown files**, not code.

- File path: `content/<section>/<slug>.<locale>.md` (e.g.
  `content/activities/utsunomiya-meditation-course.ja.md`). A bare `<slug>.md` is used as
  a fallback if no per‑locale file exists.
- Frontmatter fields (`src/lib/content.ts` → `ContentMeta`): `title`, `date` (YYYY‑MM‑DD),
  `cover`, `gallery[]`, `excerpt`, `locale`, `published` (`false` hides it), `featured`
  (sorts to top), and `youtube` (for videos). See `content/_template/`.
- To **add** an item: copy the matching `_template/*.md`, rename to
  `<slug>.<locale>.md`, fill frontmatter + body, drop images under
  `public/images/<section>/<slug>/`.
- Listing pages auto‑pick up files; detail pages live at `/[locale]/<section>/<slug>`.

**Blog posts are different** — they live in the **database**, not Markdown. Edit them in
the admin at `/admin/blog` (see §9).

Site chrome text (nav labels, footer, contact address, register form labels, etc.) lives
in **`src/i18n/dictionaries.ts`** (one `ja` block + one `en` block).

---

## 8. Internationalisation (two separate systems)

- **Public site:** locale is in the URL (`/ja/...`, `/en/...`). Config in
  `src/i18n/config.ts`; strings in `src/i18n/dictionaries.ts`; `middleware.ts` redirects
  `/` → `/ja`.
- **Admin panel:** trilingual **ja / th / en**, chosen via the switcher in the top bar and
  stored in the **`admin_lang` cookie**. Dictionary + `t()`/`makeT()` in
  **`src/lib/adminI18n.ts`** (pure data, safe on server + client). Server pages read the
  cookie via `getAdminLang()` (`src/lib/adminLang.ts`) and pass `lang` to client
  components. **To add an admin string, add a key to the dict in `adminI18n.ts`** — never
  hardcode UI text in admin components.

---

## 9. Database & admin panel

### Schema (`src/db/schema.ts`)
- **`authors`** — public byline (name, avatar, bio) keyed by email.
- **`articles`** — blog posts (Markdown `body`, `locale` ja|en, `status` draft|published).
- **`registrations`** — event sign‑ups (one open course; `session_date` = a cohort token).
- **`users`** — admin accounts + permissions (see below).
- **`course_dates`** — selectable cohorts shown on the registration form.

### Migrations workflow
1. Edit `src/db/schema.ts`.
2. `npm run db:generate` → creates `drizzle/NNNN_*.sql` (review it; add seed `INSERT`s if needed).
3. `npm run db:migrate` → applies it to the DB in `DATABASE_URL`.
4. Commit the generated SQL + `drizzle/meta/*`.
> ⚠️ **Dev and prod currently share ONE Neon database.** Running `db:migrate` locally
> already changes production data. For risky changes, create a separate **Neon dev branch**
> and point your local `DATABASE_URL` at it; let the owner run prod migrations.

### Auth & permissions (`src/auth.ts`, `src/lib/admin.ts`)
- **Sign‑in is Google‑only.** A user may sign in only if a row exists in `users` (active)
  **or** their email is in `ADMIN_EMAILS`.
- **`ADMIN_EMAILS` = super‑admin bootstrap:** those emails always get full access and are
  auto‑provisioned into `users` (full admin) on first sign‑in — so the first admin can
  then invite others from the Users page.
- **Permission flags per user** (independent, no single role): `is_admin` (full access incl.
  user management), `blog_role` (`none|writer|editor|director`), `can_manage_registrations`,
  `can_manage_course_dates`, `notify_registrations` (§10). Guards: `requireAdmin`,
  `requireBlog`, `requireRegistrations`, `requireCourseDates` in `src/lib/admin.ts`.
- The sidebar shows only the sections a user is allowed. A signed‑in user with no sections
  sees a friendly "no access" page (not a redirect loop).

### Admin sections (`/admin`, behind the `(panel)` sidebar shell)
- **Blog** (`/admin/blog`) — list / create / edit posts (`PostEditor`), draft↔publish,
  image upload, AI draft + AI cover image.
- **Registrations** (`/admin/registrations`) — master‑detail board: summary cards, a cohort
  **dropdown** filter, list + detail panel (mark handled / delete), CSV export.
- **Course dates** (`/admin/course-dates`) — CRUD the cohorts shown on the public form
  (bilingual labels, date, sort order, active toggle). Past/inactive cohorts auto‑hide.
- **Users** (`/admin/users`) — invite by email, set permissions + the notify checkbox.

There is a memorable shortcut: **`/login` → `/admin`**.

---

## 10. Registration emails

On each new registration (`/api/register`), Resend sends a confirmation to the registrant
and a notification to the **team**. Team recipients = `REGISTRATION_TEAM_EMAILS` (env)
**merged + deduped with** every active user that has the **`notify_registrations`** flag
(toggled by the "receive email on new registration" checkbox on the Users page). So the
team list is managed from the admin UI — no code change needed to add/remove a recipient.

---

## 11. Maintenance cheat‑sheet

| Task | Where |
|------|-------|
| Change homepage / nav / footer / contact text | `src/i18n/dictionaries.ts` (+ the relevant `page.tsx`) |
| Add / edit an activity, news, or video | `content/<section>/<slug>.<locale>.md` (copy `_template/`) |
| Write / edit a blog post | Admin → `/admin/blog` |
| Add / change an event cohort (date) | Admin → `/admin/course-dates` |
| Add someone who receives registration emails | Admin → `/admin/users` → tick the notify box |
| Give a teammate admin access | Add their email in Admin → Users (or `ADMIN_EMAILS`) |
| Change a DB table | `src/db/schema.ts` → `db:generate` → review → `db:migrate` |
| Change admin UI wording (ja/th/en) | `src/lib/adminI18n.ts` |
| Ship a change | Commit → push a branch → PR (Vercel preview) → merge to `main` (prod) |

---

## 12. Conventions & gotchas

- **Always `npm run build` before pushing** — it typechecks the whole app.
- **Next.js 16:** read `node_modules/next/dist/docs/` when unsure; route handler `params`
  is a `Promise` (`const { id } = await params`).
- **Don't commit secrets.** Keep them in `.env.local` / Vercel env.
- **Migrations hit the shared prod DB** — see §9. Be careful or use a Neon dev branch.
- **Screenshots / scratch files** go under `screenshots/` (gitignored), never the repo root.
- Admin pages are server components gated per request; AI / DB calls are server‑side only.
- Pushing to `main` deploys to production immediately. Prefer PRs so changes get a Vercel
  preview and a review first. (`main` is currently unprotected — consider enabling branch
  protection + required review.)

---

## 13. Other docs

- `AGENTS.md` — short rules auto‑read by AI agents (points here).
- `BLOG_SETUP.md` — original blog/CMS setup notes.
- `STATUS.md`, `requirements.md` — historical planning notes (may be partly outdated; this
  file is authoritative).
