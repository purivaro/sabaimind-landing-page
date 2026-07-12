# Google Stitch Design Prompts

Prompts สำหรับใช้กับ Google Stitch (https://stitch.withgoogle.com) เพื่อ generate UI design สำหรับเว็บ Sabaimind

---

## Context (background research)

จากการศึกษา https://www.sabaimind.or.jp:

**องค์กร:** NPO法人サバーイマインド (Sabai Mind NPO) — สอนสมาธิและสติแบบไทยให้คนญี่ปุ่น เพื่อช่วยให้จิตใจสงบจาก stress สูง + จัดกิจกรรมแลกเปลี่ยนวัฒนธรรมไทย (สงกรานต์, ปล่อยโคมลอย)

**Target audience:** คนทำงานญี่ปุ่นที่เครียด, โรงเรียน, บริษัท, ชุมชน

**Tagline:** "Make You Mindful" / 瞑想を通じて日本人の心の平安を実現する

**Visual direction:**
- Calm, meditative, generous whitespace
- Warm earth tones: off-white #FAF7F2, charcoal #2A2A28, gold/amber #C89B5C, soft sage #7A9080
- Subtle Thai motifs (lotus, soft geometric) — ไม่ touristy
- Modern sans-serif (Noto Sans JP) + refined serif headlines (Shippori Mincho)
- Editorial photography: candid meditation, natural light, sky lanterns at dusk
- Cards with soft shadows, 8-12px rounded corners
- Mood references: Aesop, Muji, ZEN-CALM, Japanese ryokan websites

---

## Master Prompt (สร้าง full website ในครั้งเดียว)

```
Design a calm, modern website for "Sabaimind" — a Japan-based NPO that teaches Thai-style meditation and mindfulness to help Japanese people find mental peace, and runs Thai cultural events (Songkran, sky lantern festivals).

Target audience: stressed professionals, schools, companies, and wellness-curious community members in Japan. Bilingual site (Japanese primary, Thai secondary).

Tagline: "Make You Mindful" / 瞑想を通じて日本人の心の平安を実現する

Visual style:
- Calm, meditative, spacious — generous whitespace
- Warm earth-tone palette: off-white (#FAF7F2) backgrounds, charcoal text (#2A2A28), warm gold/amber accent (#C89B5C), soft sage/jade secondary (#7A9080)
- Subtle Thai-inspired motifs (lotus, soft geometric patterns) used sparingly — not touristy
- Modern sans-serif typography with a touch of warmth (e.g. Noto Sans JP / Sans Thai for body, a refined serif like Shippori Mincho for headlines)
- Large editorial-style hero photography: candid meditation moments, natural light, peaceful expressions, hands forming mudras, sky lanterns at dusk
- Card-based layouts with soft shadows and rounded corners (8-12px)
- Smooth, slow micro-animations (no aggressive motion)

Pages to design:
1. Home — full-width hero with mission statement + 1-2 line tagline, language switcher (JP/TH), featured activities grid (3 cards), latest news (3 items), video highlight, CTA to contact
2. About (組織について) — long-form editorial layout, founder photo, mission/vision/values in 3-column section, timeline of organization
3. Activities (活動) — masonry/grid of activity cards with cover photo, date, short excerpt; filter by category (meditation / cultural / workshops)
4. News (お知らせ) — clean list view with date, title, excerpt; sidebar with categories
5. Videos (動画) — YouTube thumbnail grid (3 columns), play button overlay, subtle hover scale
6. Contact (お問い合わせ) — split layout: contact form (name, email, message) on the left, organization info + map + social links on the right

Components needed: sticky transparent-on-top navigation with logo + 5 menu items + JP/TH switcher; footer with org info, quick links, social, copyright; markdown article template for activity/news detail pages.

Mood references: Aesop, Muji, ZEN-CALM, traditional Japanese ryokan websites — restrained, premium, contemplative. Not flashy, not corporate, not new-age-stocky.
```

---

## Per-page Prompts (refine ทีละหน้า)

### Home
```
Design a homepage for Sabaimind, a Japanese NPO teaching Thai meditation. Hero section: full-bleed photo of someone meditating in soft morning light, overlay headline in elegant Japanese serif "瞑想を通じて、心に平安を" (Find peace through meditation), small sub-line in Thai "ทำสมาธิ ให้จิตใจสงบ", primary CTA button "活動を見る". Below: 3 activity cards with cover photos, "Latest News" 3-row list, featured YouTube video, quiet footer CTA. Color: off-white #FAF7F2 base, warm gold #C89B5C accents, charcoal #2A2A28 text. Generous whitespace, calm, premium.
```

### Activities listing
```
Design an activities listing page for a meditation NPO. Page title "活動" in large serif. Filter chips (All / Meditation / Cultural Events / Workshops). Below: 2-column responsive grid of activity cards. Each card: 4:3 cover photo with subtle rounded corners, date in small uppercase label, title in medium-weight serif, 2-line excerpt in light gray, no visible button (whole card clickable, soft hover lift). Aesthetic: Aesop-meets-Japanese-minimalism. Warm off-white background.
```

### Article detail (กิจกรรม / ข่าว)
```
Design a long-form article page for a meditation NPO. Centered single column, max 720px wide. Title in large serif at top, date and category as small label above. Hero cover image full-width below title, 16:9 ratio. Body text in comfortable Japanese sans-serif, 18px, generous line-height (1.8). Pull quotes styled with warm gold left border. Image gallery section near bottom (3-column). End with small "back to activities" link and share buttons. Calm, editorial, magazine-like.
```

### Contact
```
Design a contact page for a Japanese meditation NPO. Split layout 60/40. Left: contact form with fields Name (お名前), Email (メールアドレス), Message (メッセージ), and a warm gold submit button "送信する". Form fields have soft underline style, no boxes. Right: organization details — address, phone, email, small embedded map, social icons (Instagram, Facebook, YouTube). Background off-white, charcoal text, gold accent only on the button and link hovers. Quiet and trustworthy.
```

---

## เคล็ดลับการใช้

- เริ่มด้วย **Master Prompt** แล้วค่อย refine ทีละหน้า
- ถ้าผลออกมา "AI generic" → เพิ่ม *"editorial, restrained, not generic SaaS landing page"*
- ถ้าสีฉูดฉาด → เพิ่ม *"muted earth tones only, no bright colors"*
- ถ้าอยากมี Thai มากขึ้น → เพิ่ม *"subtle Thai temple roof silhouette in footer, lotus pattern as section divider"*
- Generate หลาย version แล้ว mix component ที่ชอบ

## หลังได้ design แล้ว
1. Export Stitch design → screenshot / Figma / HTML
2. ให้ Claude Code implement ลง `src/app/[locale]/layout.tsx`, `Nav.tsx`, `Footer.tsx`, page templates
3. ตั้ง color palette + fonts ใน `src/app/globals.css` (Tailwind v4 `@theme inline`)
