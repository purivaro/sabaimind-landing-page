# Agent guide

**Read [`MAINTAINING.md`](./MAINTAINING.md) first** — it explains the whole site
(stack, structure, content, database, admin panel, deploy) and how to maintain it.

<!-- BEGIN:nextjs-agent-rules -->
## This is NOT the Next.js you know

This version (Next.js 16, App Router) has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Quick rules

- Run `npm run build` before pushing (it typechecks the whole app).
- Don't commit secrets; they live in `.env.local` / Vercel env.
- DB migrations (`npm run db:migrate`) hit the **shared prod** Neon DB — be careful (see MAINTAINING.md §9).
- Push to `main` deploys to production. Prefer a branch + PR (gets a Vercel preview).
- Admin UI text is trilingual (ja/th/en) — add keys to `src/lib/adminI18n.ts`, don't hardcode.
