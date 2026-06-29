// Trilingual i18n for the admin backend (ja / th / en). Pure data + helpers,
// safe to import from both server and client components. The active language is
// stored in the `admin_lang` cookie (see adminLang.ts / LangSwitcher).

export type AdminLang = "ja" | "th" | "en";

export const ADMIN_LANGS: AdminLang[] = ["ja", "th", "en"];
export const LANG_LABEL: Record<AdminLang, string> = {
  ja: "日本語",
  th: "ไทย",
  en: "EN",
};
export const DEFAULT_ADMIN_LANG: AdminLang = "ja";

type Entry = { ja: string; th: string; en: string };

const dict: Record<string, Entry> = {
  // ── brand / chrome ────────────────────────────────────────────────
  "brand.title": { ja: "Sabai Mind", th: "Sabai Mind", en: "Sabai Mind" },
  "brand.sub": { ja: "管理パネル", th: "ระบบจัดการ", en: "Admin panel" },
  "nav.viewsite": { ja: "サイトを見る", th: "ดูเว็บไซต์", en: "View site" },
  "common.logout": { ja: "ログアウト", th: "ออกจากระบบ", en: "Log out" },

  // ── nav groups + items ────────────────────────────────────────────
  "group.content": { ja: "コンテンツ", th: "เนื้อหา", en: "Content" },
  "group.course": { ja: "コース", th: "คอร์ส", en: "Course" },
  "group.admin": { ja: "管理", th: "ผู้ดูแล", en: "Admin" },
  "nav.blog": { ja: "ブログ", th: "บล็อก", en: "Blog" },
  "nav.registrations": { ja: "お申し込み", th: "ผู้สมัคร", en: "Registrations" },
  "nav.coursedates": { ja: "開催日", th: "รุ่น/วันจัด", en: "Course dates" },
  "nav.users": { ja: "ユーザー", th: "ผู้ใช้", en: "Users" },

  // ── roles ─────────────────────────────────────────────────────────
  "role.admin": { ja: "管理者", th: "ผู้ดูแลระบบ", en: "Admin" },
  "role.director": { ja: "編集長", th: "หัวหน้ากองบรรณาธิการ", en: "Director" },
  "role.editor": { ja: "編集者", th: "บรรณาธิการ", en: "Editor" },
  "role.writer": { ja: "執筆者", th: "ผู้เขียน", en: "Writer" },
  "role.none": { ja: "なし", th: "ไม่มี", en: "None" },
  "role.member": { ja: "メンバー", th: "สมาชิก", en: "Member" },

  // ── common ────────────────────────────────────────────────────────
  "common.save": { ja: "保存", th: "บันทึก", en: "Save" },
  "common.saving": { ja: "保存中…", th: "กำลังบันทึก…", en: "Saving…" },
  "common.cancel": { ja: "キャンセル", th: "ยกเลิก", en: "Cancel" },
  "common.edit": { ja: "編集", th: "แก้ไข", en: "Edit" },
  "common.delete": { ja: "削除", th: "ลบ", en: "Delete" },
  "common.active": { ja: "アクティブ", th: "ใช้งาน", en: "Active" },
  "common.optional": { ja: "（任意）", th: "(ไม่บังคับ)", en: "(optional)" },
  "common.saveFailed": { ja: "保存に失敗しました", th: "บันทึกไม่สำเร็จ", en: "Could not save" },

  // ── titles ────────────────────────────────────────────────────────
  "title.blog": { ja: "ブログ記事", th: "บทความบล็อก", en: "Blog posts" },
  "title.registrations": { ja: "お申し込み一覧", th: "รายชื่อผู้สมัคร", en: "Registrations" },
  "title.coursedates": { ja: "開催日の管理", th: "จัดการรุ่น/วันจัด", en: "Course dates" },
  "title.users": { ja: "ユーザー管理", th: "จัดการผู้ใช้", en: "User management" },

  // ── blog list ─────────────────────────────────────────────────────
  "blog.new": { ja: "新規作成", th: "เขียนใหม่", en: "New post" },
  "blog.empty": { ja: "記事がまだありません。", th: "ยังไม่มีบทความ", en: "No posts yet." },
  "blog.th.title": { ja: "タイトル", th: "หัวข้อ", en: "Title" },
  "blog.th.lang": { ja: "言語", th: "ภาษา", en: "Lang" },
  "blog.th.status": { ja: "状態", th: "สถานะ", en: "Status" },
  "blog.th.updated": { ja: "更新", th: "อัปเดต", en: "Updated" },
  "blog.th.author": { ja: "著者", th: "ผู้เขียน", en: "Author" },
  "status.draft": { ja: "下書き", th: "ฉบับร่าง", en: "Draft" },
  "status.published": { ja: "公開", th: "เผยแพร่แล้ว", en: "Published" },

  // ── registrations ─────────────────────────────────────────────────
  "reg.all": { ja: "すべて", th: "ทั้งหมด", en: "All" },
  "reg.csv": { ja: "CSV", th: "CSV", en: "CSV" },
  "reg.empty": { ja: "お申し込みはまだありません。", th: "ยังไม่มีผู้สมัคร", en: "No registrations yet." },
  "reg.th.applied": { ja: "申込日時", th: "วันที่สมัคร", en: "Applied" },
  "reg.th.date": { ja: "開催日", th: "รุ่น/วันจัด", en: "Session" },
  "reg.th.name": { ja: "氏名", th: "ชื่อ", en: "Name" },
  "reg.th.contact": { ja: "連絡先", th: "ติดต่อ", en: "Contact" },
  "reg.th.attr": { ja: "属性", th: "ข้อมูล", en: "Profile" },
  "reg.th.source": { ja: "きっかけ", th: "รู้จักจาก", en: "Source" },
  "reg.th.photo": { ja: "写真", th: "รูปถ่าย", en: "Photo" },
  // summary
  "reg.sum.total": { ja: "合計", th: "ทั้งหมด", en: "Total" },
  "reg.sum.pending": { ja: "未対応", th: "รอดำเนินการ", en: "Pending" },
  "reg.sum.handled": { ja: "対応済み", th: "ดำเนินการแล้ว", en: "Handled" },
  // list + detail
  "reg.recent": { ja: "申し込み", th: "รายการสมัคร", en: "Registrations" },
  "reg.details": { ja: "詳細", th: "รายละเอียด", en: "Details" },
  "reg.selectPrompt": {
    ja: "左の一覧から申し込みを選択してください。",
    th: "เลือกผู้สมัครจากรายการด้านซ้ายเพื่อดูรายละเอียด",
    en: "Select a registration from the list to see details.",
  },
  "reg.handledBadge": { ja: "対応済み", th: "เสร็จแล้ว", en: "Handled" },
  "reg.pendingBadge": { ja: "未対応", th: "รอดำเนินการ", en: "Pending" },
  "reg.markHandled": { ja: "対応済みにする", th: "ทำเครื่องหมายว่าเสร็จ", en: "Mark handled" },
  "reg.markPending": { ja: "未対応に戻す", th: "กลับเป็นรอดำเนินการ", en: "Mark pending" },
  "reg.confirmDelete": {
    ja: "この申し込みを削除しますか？",
    th: "ลบรายการสมัครนี้หรือไม่?",
    en: "Delete this registration?",
  },
  "reg.d.session": { ja: "開催日", th: "รุ่น/วันจัด", en: "Session" },
  "reg.d.applied": { ja: "申込日時", th: "วันที่สมัคร", en: "Applied" },
  "reg.d.name": { ja: "氏名", th: "ชื่อ", en: "Name" },
  "reg.d.furigana": { ja: "ふりがな", th: "ฟุริงานะ", en: "Furigana" },
  "reg.d.email": { ja: "メール", th: "อีเมล", en: "Email" },
  "reg.d.gender": { ja: "性別", th: "เพศ", en: "Gender" },
  "reg.d.nationality": { ja: "国籍", th: "สัญชาติ", en: "Nationality" },
  "reg.d.prefecture": { ja: "都道府県", th: "จังหวัด", en: "Prefecture" },
  "reg.d.phone": { ja: "電話", th: "โทรศัพท์", en: "Phone" },
  "reg.d.source": { ja: "きっかけ", th: "รู้จักจาก", en: "Referral" },
  "reg.d.photo": { ja: "写真掲載", th: "ยินยอมให้ลงรูป", en: "Photo consent" },

  // ── course dates ──────────────────────────────────────────────────
  "cd.subtitle": {
    ja: "申し込みフォームに表示される開催日を管理します。非アクティブ・過去日は自動的に非表示になります。",
    th: "จัดการวันจัด/รุ่นที่แสดงในฟอร์มสมัคร รุ่นที่ปิดหรือวันที่ผ่านแล้วจะถูกซ่อนอัตโนมัติ",
    en: "Manage the sessions shown on the registration form. Inactive or past dates are hidden automatically.",
  },
  "cd.add": { ja: "開催日を追加", th: "เพิ่มรุ่น/วันจัด", en: "Add date" },
  "cd.new": { ja: "新しい開催日", th: "รุ่น/วันจัดใหม่", en: "New date" },
  "cd.edit": { ja: "開催日を編集", th: "แก้ไขรุ่น/วันจัด", en: "Edit date" },
  "cd.f.date": { ja: "日付", th: "วันที่", en: "Date" },
  "cd.f.order": { ja: "表示順 (小さいほど先)", th: "ลำดับ (น้อยขึ้นก่อน)", en: "Sort order (lower first)" },
  "cd.f.labelJa": { ja: "ラベル（日本語）*", th: "ป้ายชื่อ (ญี่ปุ่น) *", en: "Label (Japanese) *" },
  "cd.f.labelEn": { ja: "ラベル（English）", th: "ป้ายชื่อ (อังกฤษ)", en: "Label (English)" },
  "cd.f.activeHelp": { ja: "アクティブ（フォームに表示）", th: "ใช้งาน (แสดงในฟอร์ม)", en: "Active (show on form)" },
  "cd.th.order": { ja: "順", th: "ลำดับ", en: "Order" },
  "cd.th.date": { ja: "日付", th: "วันที่", en: "Date" },
  "cd.th.label": { ja: "ラベル", th: "ป้ายชื่อ", en: "Label" },
  "cd.th.status": { ja: "状態", th: "สถานะ", en: "Status" },
  "cd.hidden": { ja: "非表示", th: "ซ่อน", en: "Hidden" },
  "cd.empty": { ja: "開催日がまだありません。", th: "ยังไม่มีรุ่น/วันจัด", en: "No dates yet." },
  "cd.required": { ja: "日本語ラベルは必須です", th: "ต้องกรอกป้ายชื่อภาษาญี่ปุ่น", en: "Japanese label is required" },
  "cd.confirmDelete": { ja: "「{name}」を削除しますか？", th: "ลบ “{name}” หรือไม่?", en: "Delete “{name}”?" },

  // ── users ─────────────────────────────────────────────────────────
  "um.subtitle": {
    ja: "管理画面にアクセスできるユーザーと権限を管理します。ログインは Google アカウントのみ。招待したメールアドレスで初回ログイン時にアクセスが有効になります。",
    th: "จัดการผู้ใช้ที่เข้าระบบหลังบ้านได้และสิทธิ์ของแต่ละคน ล็อกอินผ่าน Google เท่านั้น อีเมลที่เชิญจะใช้งานได้เมื่อล็อกอินครั้งแรก",
    en: "Manage who can access the admin and their permissions. Sign-in is Google-only; invited emails gain access on first sign-in.",
  },
  "um.invite": { ja: "ユーザーを招待", th: "เชิญผู้ใช้", en: "Invite user" },
  "um.new": { ja: "ユーザーを招待", th: "เชิญผู้ใช้", en: "Invite user" },
  "um.edit": { ja: "ユーザーを編集", th: "แก้ไขผู้ใช้", en: "Edit user" },
  "um.f.email": { ja: "メールアドレス（Google）*", th: "อีเมล (Google) *", en: "Email (Google) *" },
  "um.f.byline": { ja: "表示名（署名）", th: "ชื่อที่แสดง (ผู้เขียน)", en: "Display name (byline)" },
  "um.f.bio": { ja: "プロフィール（任意）", th: "ประวัติย่อ (ไม่บังคับ)", en: "Profile (optional)" },
  "um.perm": { ja: "権限", th: "สิทธิ์", en: "Permissions" },
  "um.admin": { ja: "管理者（ユーザー管理を含む全権限）", th: "ผู้ดูแลระบบ (ทุกสิทธิ์ รวมจัดการผู้ใช้)", en: "Admin (all rights, incl. user management)" },
  "um.blogRole": { ja: "ブログ権限", th: "สิทธิ์บล็อก", en: "Blog role" },
  "um.canReg": { ja: "申込の管理", th: "จัดการผู้สมัคร", en: "Manage registrations" },
  "um.canCd": { ja: "開催日の管理", th: "จัดการรุ่น/วันจัด", en: "Manage course dates" },
  "um.activeLogin": { ja: "有効（ログインを許可）", th: "ใช้งาน (อนุญาตให้ล็อกอิน)", en: "Active (allow sign-in)" },
  "um.notify": {
    ja: "新規申し込みのメール通知を受け取る",
    th: "รับอีเมลแจ้งเตือนเมื่อมีคนสมัครกิจกรรม",
    en: "Receive email when someone registers",
  },
  "um.notifyTag": { ja: "通知", th: "แจ้งเตือน", en: "Notified" },
  "um.th.email": { ja: "メール", th: "อีเมล", en: "Email" },
  "um.th.name": { ja: "表示名", th: "ชื่อที่แสดง", en: "Name" },
  "um.th.perm": { ja: "権限", th: "สิทธิ์", en: "Permissions" },
  "um.th.status": { ja: "状態", th: "สถานะ", en: "Status" },
  "um.you": { ja: "自分", th: "คุณ", en: "You" },
  "um.active": { ja: "有効", th: "ใช้งาน", en: "Active" },
  "um.inactive": { ja: "無効", th: "ปิดใช้", en: "Inactive" },
  "um.empty": { ja: "ユーザーがまだいません。", th: "ยังไม่มีผู้ใช้", en: "No users yet." },
  "um.permFull": { ja: "管理者（全権限）", th: "ผู้ดูแล (ทุกสิทธิ์)", en: "Admin (all)" },
  "um.permNone": { ja: "権限なし", th: "ไม่มีสิทธิ์", en: "No permissions" },
  "um.invalidEmail": { ja: "有効なメールアドレスを入力してください", th: "กรุณากรอกอีเมลที่ถูกต้อง", en: "Enter a valid email" },
  "um.confirmDelete": { ja: "「{email}」のアクセスを削除しますか？", th: "ลบสิทธิ์เข้าระบบของ “{email}” หรือไม่?", en: "Remove access for “{email}”?" },
  "um.roleNone": { ja: "なし", th: "ไม่มี", en: "None" },

  // ── no-access (signed in, no admin sections) ─────────────────────
  "noaccess.title": {
    ja: "アクセス権がありません",
    th: "ยังไม่มีสิทธิ์เข้าใช้งาน",
    en: "No admin access",
  },
  "noaccess.body": {
    ja: "このアカウントには管理画面の権限が割り当てられていません。管理者にお問い合わせください。",
    th: "บัญชีนี้ยังไม่ได้รับสิทธิ์เข้าหน้าจัดการ กรุณาติดต่อผู้ดูแลระบบ",
    en: "This account has no admin sections assigned. Please contact an administrator.",
  },

  // ── login ─────────────────────────────────────────────────────────
  "login.sub": { ja: "管理画面 / Admin", th: "ระบบจัดการ / Admin", en: "Admin" },
  "login.google": { ja: "Google でログイン", th: "เข้าสู่ระบบด้วย Google", en: "Sign in with Google" },
  "login.note": {
    ja: "許可されたメールアドレスのみアクセスできます。",
    th: "เฉพาะอีเมลที่ได้รับอนุญาตเท่านั้นที่เข้าได้",
    en: "Only authorised email addresses can access.",
  },
};

/** Translate a key for the given language, interpolating {var} placeholders. */
export function t(
  lang: AdminLang,
  key: string,
  vars?: Record<string, string | number>,
): string {
  const e = dict[key];
  let s = e ? e[lang] || e.ja : key;
  if (vars)
    for (const [k, v] of Object.entries(vars))
      s = s.replace(`{${k}}`, String(v));
  return s;
}

/** Bind the language once: returns a `t(key, vars?)` helper. */
export function makeT(lang: AdminLang) {
  return (key: string, vars?: Record<string, string | number>) =>
    t(lang, key, vars);
}

export function normalizeAdminLang(v: unknown): AdminLang {
  return ADMIN_LANGS.includes(v as AdminLang) ? (v as AdminLang) : DEFAULT_ADMIN_LANG;
}
