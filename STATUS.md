# Project Status

อัปเดตล่าสุด: 2026-05-15

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
  - หรือ Cloudflare Workers + MailChannels / SendGrid
- เก็บ API key ใน `.env.local` (และ Cloudflare Pages env vars)

### 3. Deploy Cloudflare Pages
- ติดตั้ง `@cloudflare/next-on-pages` และ adapter
- ตั้ง build command ใน Pages: `npx @cloudflare/next-on-pages@1`
- output directory: `.vercel/output/static`
- Bind custom domain: `new.sabaimind.or.jp`
- ตั้ง env vars (Resend API key ฯลฯ)

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
- **โดเมน:** https://new.sabaimind.or.jp (ยังไม่ deploy)
- **ภาษาหลัก:** ญี่ปุ่น (เจ้าของเริ่มทำเป็นไทยก่อน)
- **Workflow content:** Claude Code สร้าง markdown ให้ + เจ้าของแก้ข้อความเล็กน้อยใน `.md` เอง
- **ไม่มี:** ระบบรับบริจาค (cut ออกตั้งแต่แรก), CMS หลังบ้าน, payment

## คำสั่งที่ใช้บ่อย
```bash
npm run dev          # dev server → http://localhost:3000 (redirect /th)
npm run build        # production build (validate ก่อน push)
git push             # auto-deploy ทันทีที่ Cloudflare Pages พร้อม
```
