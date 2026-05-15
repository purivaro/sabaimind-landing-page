# Sabaimind Website Requirements

## ภาพรวม
สร้างเว็บไซต์ใหม่ที่ https://new.sabaimind.or.jp เพื่อประชาสัมพันธ์กิจกรรมขององค์กร Sabaimind

แหล่งข้อมูลเริ่มต้น: ดึงข้อมูลและรูปภาพจากเว็บเดิม https://www.sabaimind.or.jp/

---

## Tech Stack
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Hosting:** Cloudflare Pages (ใช้ `@cloudflare/next-on-pages`)
- **Content:** Markdown files (จัดการใน repo, ใช้ AI ช่วยสร้าง page)
- **Email service:** สำหรับ Contact form (เช่น Resend หรือ Cloudflare Workers + SMTP)

---

## ภาษา (i18n)
- **หลัก:** ภาษาญี่ปุ่น (`ja`)
- **เริ่มทำ:** ภาษาไทย (`th`) ก่อน เพื่อให้เจ้าของเว็บตรวจสอบเนื้อหาได้ (อ่านญี่ปุ่นไม่ออก)
- ตั้งโครงสร้าง i18n รองรับทั้งสองภาษาตั้งแต่เริ่ม

---

## โครงสร้างเนื้อหา (5 หน้า)

### 1. ข้อมูลองค์กร (About)
- ประวัติ / วิสัยทัศน์ / พันธกิจ
- ทีมงาน / ผู้ก่อตั้ง

### 2. กิจกรรม (Activities)
- รายการกิจกรรมขององค์กร
- 1 ไฟล์ markdown = 1 กิจกรรม

### 3. ข่าวสาร (News)
- ประกาศ / ข่าวประชาสัมพันธ์
- 1 ไฟล์ markdown = 1 ข่าว

### 4. วิดีโอ (Videos)
- Embed จาก YouTube
- Markdown เก็บ metadata + YouTube URL

### 5. ติดต่อเรา (Contact)
- ฟอร์มติดต่อ → ส่งเข้า **Email**
- ข้อมูลติดต่อพื้นฐาน (ที่อยู่, social media)

> **หมายเหตุ:** หน้า "บุญ" / ระบบรับบริจาค — ยังไม่ทำในเฟสนี้

---

## Content Structure
```
content/
├── about/           # ข้อมูลองค์กร
├── activities/      # กิจกรรม
├── news/            # ข่าวสาร
└── videos/          # วิดีโอ (metadata + YouTube URL)

public/images/
├── activities/
│   └── meditation-2025/
│       ├── cover.jpg
│       └── photo-1.jpg
├── news/
└── about/
```

แต่ละไฟล์ markdown ใช้ frontmatter (title, date, cover image, locale, ฯลฯ) + เนื้อหา markdown

### ภาพประกอบ
- เก็บไว้ใน `public/images/` แบ่งโฟลเดอร์ตามหมวด
- อ้างอิงจาก markdown ด้วย absolute path เช่น `/images/activities/meditation-2025/cover.jpg`
- ใช้ `next/image` เพื่อ optimize ภาพอัตโนมัติ
- ตัวอย่าง frontmatter:
  ```markdown
  ---
  title: "งานปฏิบัติธรรม 2025"
  date: 2025-03-15
  cover: /images/activities/meditation-2025/cover.jpg
  gallery:
    - /images/activities/meditation-2025/photo-1.jpg
    - /images/activities/meditation-2025/photo-2.jpg
  ---
  ```
- ถ้าอนาคตรูปเยอะมาก (>500MB) ค่อยพิจารณาย้ายไป Cloudflare R2 / Images

---

## Design
- **ทำใหม่ทั้งหมด** (ไม่ยึดดีไซน์เว็บเดิม)
- ใช้ **Google Stitch** ออกแบบ mockup ก่อน แล้วค่อย implement

---

## Workflow การจัดการเนื้อหา

ใช้สองวิธีร่วมกัน:

### 1. ให้ Claude Code ทำ (หลัก)
เหมาะกับงานที่ซับซ้อน เช่น:
- สร้างหน้า/บทความใหม่ทั้งหน้า
- เพิ่มข่าว/กิจกรรมพร้อมรูปและ frontmatter ครบ
- แก้ไขหลายไฟล์พร้อมกัน
- ปรับโครงสร้าง / refactor

วิธีใช้: บอก Claude เป็นภาษาคน เช่น *"เพิ่มข่าวใหม่ชื่อ X วันที่ Y เนื้อหา..."*

### 2. แก้เองใน `.md` (สำหรับงานเล็ก)
เหมาะกับ:
- แก้คำผิด
- อัปเดตเบอร์โทร / ที่อยู่
- เปลี่ยนวันที่ / รายละเอียดเล็กน้อย

วิธีใช้: เปิดไฟล์ `.md` ใน VS Code → แก้ → save → commit + push

### เคล็ดลับให้แก้เองง่ายขึ้น
- **Frontmatter อ่านง่าย** — key เป็นภาษาอังกฤษสั้นๆ มี comment กำกับ
  ```markdown
  ---
  title: "งานปฏิบัติธรรม 2025"  # ชื่อที่จะแสดงบนเว็บ
  date: 2025-03-15              # รูปแบบ YYYY-MM-DD
  cover: /images/activities/meditation-2025/cover.jpg
  published: true               # false = ซ่อน
  ---
  ```
- **VS Code extension แนะนำ**: `Markdown All in One`, `Markdown Preview Enhanced`
- **รัน dev server ค้างไว้** (`npm run dev`) — save แล้วเห็นผลทันทีบน browser (hot reload)
- **มีไฟล์ template** ที่ `content/_template/` — copy ไปแก้ ไม่ต้องจำ field

---

## แผนการทำงาน

1. ✅ **Init project** — `create-next-app` + Tailwind + โครงสร้างโฟลเดอร์
2. ✅ **ตั้ง i18n** — รองรับ `th` (default ระหว่างพัฒนา) + `ja`
3. ✅ **ระบบอ่าน Markdown** — gray-matter + next-mdx-remote + remark-gfm
4. ⏳ **Layout + Navigation** — มี placeholder แล้ว, รอ design จริงจาก Google Stitch
5. ✅ **สร้าง routes 5 หน้า** — โครงเปล่าพร้อม sample content
6. ⏳ **Contact form** — มี form UI แล้ว, ยังไม่ wire `/api/contact` กับ email service
7. ⏳ **Deploy Cloudflare Pages** — ยังไม่ทำ

ดู progress ละเอียดที่ [STATUS.md](./STATUS.md) และ Stitch design prompts ที่ [stitch-prompts.md](./stitch-prompts.md)
