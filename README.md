# Sabai Mind — sabaimind.or.jp

Website for NPO法人サバーイマインド (Sabai Mind NPO) (Thai‑style meditation & mindfulness for a Japanese
audience). Next.js 16 + Tailwind v4, Neon Postgres, deployed on Vercel.

**→ Read [`MAINTAINING.md`](./MAINTAINING.md)** for the full guide: architecture, content,
database, the `/admin` panel, environment variables, and how to deploy & maintain the site.

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in values (ask the owner)
npm run dev                  # http://localhost:3000
```

Build before pushing: `npm run build`. Pushing to `main` deploys to production; open a PR
for a Vercel preview first.
