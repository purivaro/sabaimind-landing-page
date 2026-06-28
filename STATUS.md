# Project Status

อัปเดตล่าสุด: 2026-06-28

## ✅ สิ่งที่ทำไปแล้ว

### Project setup
- Next.js 16 (App Router, Turbopack) + TypeScript + Tailwind CSS v4
- Repo: `git@github.com:purivaro/sabaimind-landing-page.git` (branch `main`)
- Local path: `/Users/purivaro/Dev/Sites/sabaimind`

### โครงสร้างโค้ด
```
src/
├── app/
│   ├── layout.tsx                    # root layout (pass-through)
│   └── [locale]/
│       ├── layout.tsx                # html/body + Nav + Footer + lang attr
│       ├── page.tsx                  # home page
│       ├── about/page.tsx
│       ├── activities/page.tsx       # listing
│       ├── activities/[slug]/page.tsx # detail
│       ├── news/page.tsx
│       ├── news/[slug]/page.tsx
│       ├── videos/page.tsx
│       ├── videos/[slug]/page.tsx
│       └── contact/page.tsx          # form UI only (no API yet)
├── components/
│   ├── Nav.tsx                       # nav with locale switcher
│   ├── Footer.tsx
│   └── Markdown.tsx                  # MDX renderer (remark-gfm)
├── i18n/
│   ├── config.ts                     # locales + defaultLocale
│   └── dictionaries.ts               # th + ja translations
├── lib/
│   ├── content.ts                    # gray-matter readers
│   └── youtube.ts                    # extract id, thumb, embed url
└── middleware.ts                     # / → /th redirect

content/
├── about/{th,ja}.md
├── activities/sample-activity.md
├── news/sample-news.md
├── videos/sample-video.md
└── _template/{activity,news,video}.md

public/images/{about,activities,news}/.gitkeep
```

### Features ที่ทำงานได้
- i18n routing: `[locale]` segment, `th` (default) + `ja`
- Middleware redirect `/` → `/th` (skip `_next`, `api`, `images`, files with extension)
- Markdown loader รองรับไฟล์แบบ `slug.md`, `slug.mdx`, `slug.locale.md`
- กรอง `published: false` และ filter ตาม `locale` ใน frontmatter
- Sort by `date` desc
- YouTube embed + thumbnail (i.ytimg.com whitelisted ใน next.config.ts)
- Tailwind typography plugin (class `prose`)
- Build ผ่าน, static pages 15 routes prerendered

---

### Blog CMS (Phase 2 — โค้ดเสร็จ, รอ provision service)

- ฐานข้อมูล Neon Postgres + Drizzle ORM (`src/db/`, migration ใน `drizzle/`)
- Public blog: `/[locale]/blog` + `/[locale]/blog/[slug]` (SEO/OG metadata, react-markdown)
- Admin: Google login (Auth.js v5, allowlist `ADMIN_EMAILS`) → `/admin/blog` + editor `/admin/blog/new`
- รูป: อัปโหลด → Vercel Blob; AI: ร่างบทความ (Claude `claude-opus-4-8`) + สร้างรูป (OpenAI `gpt-image-1`)
- **ต้องตั้งค่า service + env vars ก่อนใช้จริง** → ดู [BLOG_SETUP.md](./BLOG_SETUP.md)

---

## ⏳ ยังไม่ได้ทำ (next steps)

### 1. Design จริง (กำลังรอ)
- เขียน prompt สำหรับ **Google Stitch** ไว้แล้ว → [stitch-prompts.md](./stitch-prompts.md)
- ติดตั้ง **Stitch MCP** ใน Claude Code แล้ว
  ```bash
  claude mcp add stitch https://stitch.googleapis.com/mcp \
    --transport http \
    --header "X-Goog-Api-Key: <KEY ใน ~/.claude.json>"
  ```
  > ⚠️ ต้อง restart Claude session เพื่อใช้ MCP tools
- หลังได้ design → implement Layout, Nav, Footer, page templates ใหม่

### 2. Contact form API
- หน้า `[locale]/contact/page.tsx` มี form UI แล้ว ส่งไป `POST /api/contact`
- ต้องสร้าง `src/app/api/contact/route.ts` + เลือก email service:
  - **Resend** (แนะนำ — เรียบ, free tier 3000/เดือน, รองรับ React Email templates)
- เก็บ API key ใน `.env.local` (และ Vercel env vars)

### 3. Deploy (Vercel) — ✅ deploy แล้ว

- Deploy บน **Vercel** ผ่าน GitHub integration (project: `sabaimind-landing-page`)
- push `main` → Vercel build/deploy อัตโนมัติบน cloud (ไม่ต้องมี `vercel.json` / `.vercel` ใน repo)
- ผูก custom domain `sabaimind.or.jp` แล้ว (DNS อยู่บน Cloudflare, proxy → Vercel)
- ตั้ง env vars (Resend API key ฯลฯ) ใน Vercel → Settings → Environment Variables

### 4. เนื้อหาจริง
- ดึง content จาก https://www.sabaimind.or.jp มาแปลง Markdown
- รูปภาพ → resize/optimize ลง `public/images/`
- เริ่มภาษาไทยก่อน (เจ้าของอ่านญี่ปุ่นไม่ออก) แล้วแปล `ja` ทีหลัง

### 5. Cleanups เล็กๆ
- ลบ default assets ที่ไม่ใช้: `public/{file,globe,next,vercel,window}.svg`
- เปลี่ยน `src/app/favicon.ico` เป็น favicon ของ Sabaimind
- จัดการ multiple lockfile warning (มี `package-lock.json` ที่ `/Users/purivaro/Dev/`) — ตั้ง `turbopack.root` ใน next.config.ts ถ้าจำเป็น
- "middleware" deprecation warning → migrate เป็น `proxy` (Next.js 16) ตอนสะดวก

---

## 🔑 ข้อมูลสำคัญสำหรับ session ใหม่

- **เป้าหมาย:** เว็บประชาสัมพันธ์ NPO Sabaimind — ทำสมาธิแบบไทยให้คนญี่ปุ่น + กิจกรรมวัฒนธรรมไทย
- **โดเมน:** https://sabaimind.or.jp (live บน Vercel, DNS ผ่าน Cloudflare proxy)
- **ภาษาหลัก:** ญี่ปุ่น (เจ้าของเริ่มทำเป็นไทยก่อน)
- **Workflow content:** Claude Code สร้าง markdown ให้ + เจ้าของแก้ข้อความเล็กน้อยใน `.md` เอง
- **ไม่มี:** ระบบรับบริจาค (cut ออกตั้งแต่แรก), CMS หลังบ้าน, payment

## คำสั่งที่ใช้บ่อย
```bash
npm run dev          # dev server → http://localhost:3000 (redirect /th)
npm run build        # production build (validate ก่อน push)
git push             # push main → Vercel auto-deploy
```
