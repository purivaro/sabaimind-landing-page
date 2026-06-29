import "server-only";
import { cookies } from "next/headers";
import { normalizeAdminLang, type AdminLang } from "@/lib/adminI18n";

export const ADMIN_LANG_COOKIE = "admin_lang";

/** The admin UI language from the `admin_lang` cookie (defaults to ja). */
export async function getAdminLang(): Promise<AdminLang> {
  const c = await cookies();
  return normalizeAdminLang(c.get(ADMIN_LANG_COOKIE)?.value);
}
