# Blog CMS — Setup Guide

ระบบ blog (CMS) สำหรับ sabaimind — ฐานข้อมูล + หน้าเขียนบนเว็บ + Google login + AI ช่วยเขียน/สร้างรูป
โค้ดทำเสร็จแล้ว ที่เหลือคือ **ตั้งค่า service ภายนอก + ใส่ env vars** ตามขั้นตอนนี้

## โครงสร้างที่ได้

| ส่วน | URL | หมายเหตุ |
|---|---|---|
| Blog สาธารณะ | `/ja/blog`, `/en/blog` | รายการบทความ |
| บทความเดี่ยว | `/ja/blog/<slug>` | มี SEO/OG metadata |
| ล็อกอิน admin | `/admin/signin` | Google เท่านั้น |
| จัดการบทความ | `/admin/blog` | list + ลบ |
| เขียนใหม่ | `/admin/blog/new` | editor + AI |

**Stack:** Neon Postgres (Drizzle ORM) · Vercel Blob (รูป) · Auth.js v5 (Google) · Claude (`claude-opus-4-8`, ร่างบทความ) · OpenAI `gpt-image-1` (สร้างรูป)

---

## ขั้นตอน

### 1. Database — Neon Postgres
1. สมัคร https://neon.tech → สร้าง project
2. คัดลอก **pooled connection string** → ใส่เป็น `DATABASE_URL`
3. รัน migration (สร้างตาราง articles/authors):
   ```bash
   npm run db:migrate
   ```
   (หรือ `npm run db:push` สำหรับ dev)

### 2. รูปภาพ — Vercel Blob
1. Vercel dashboard → โปรเจกต์ → **Storage** → Create → **Blob**
2. คัดลอก token → `BLOB_READ_WRITE_TOKEN`

### 3. ล็อกอิน — Google OAuth
1. https://console.cloud.google.com → APIs & Services → Credentials
2. Create credentials → **OAuth client ID** → Web application
3. Authorized redirect URIs (ใส่ทั้งสอง):
   - `http://localhost:3000/api/auth/callback/google`
   - `https://sabaimind.or.jp/api/auth/callback/google`
4. คัดลอก → `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`
5. สร้าง secret: `npx auth secret` → `AUTH_SECRET`
6. ใส่อีเมลที่อนุญาตเข้า admin (คั่นด้วย comma) → `ADMIN_EMAILS`

### 4. AI
- `ANTHROPIC_API_KEY` จาก https://console.anthropic.com (ร่างบทความ)
- `OPENAI_API_KEY` จาก https://platform.openai.com (สร้างรูป)

### 5. ใส่ env vars
- **Local:** copy `.env.example` → `.env.local` แล้วเติมค่า
- **Production:** Vercel → Settings → Environment Variables (ใส่ครบทุกตัว) แล้ว redeploy

ดูรายการตัวแปรทั้งหมดใน [.env.example](.env.example)

---

## ใช้งาน

1. เปิด `https://sabaimind.or.jp/admin` → ล็อกอิน Google (ต้องเป็นอีเมลใน `ADMIN_EMAILS`)
2. **新規作成** → เขียนเอง หรือกด **AI で下書きを生成** (ใส่ไอเดีย → AI ร่างให้)
3. อัปโหลด/สร้างรูปปก → เลือกภาษา → **公開する**
4. บทความขึ้นที่ `/ja/blog` หรือ `/en/blog` ทันที

## ทดสอบ local
```bash
npm run dev            # http://localhost:3000
npm run db:studio      # ดู/แก้ข้อมูลใน DB (Drizzle Studio)
```

## หมายเหตุ
- ถ้ายังไม่ตั้ง `DATABASE_URL` หน้า `/blog` และ `/admin` จะ error (แต่ build ผ่าน) — เป็นเรื่องปกติจนกว่าจะตั้งค่าครบ
- บทความเก็บใน DB (ไม่ใช่ไฟล์ repo) — ต่างจากระบบ activities/news เดิมที่เป็น Markdown ใน `content/`
