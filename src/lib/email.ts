import "server-only";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const DEFAULT_FROM = "Sabai Mind <onboarding@resend.dev>";

export type RegistrationEmail = {
  email: string;
  fullName: string;
  furigana: string;
  gender: string;
  nationality: string;
  prefecture?: string | null;
  phone?: string | null;
  referralSource: string;
  photoConsent: string;
  sessionLabel: string;
  courseTitle: string;
};

function envTeamEmails(): string[] {
  const raw =
    process.env.REGISTRATION_TEAM_EMAILS || process.env.ADMIN_EMAILS || "";
  return raw
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
}

/** Env team list + any extra recipients (e.g. DB notify users), deduped. */
function teamEmails(extra: string[] = []): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const e of [...envTeamEmails(), ...extra]) {
    const v = e.trim();
    const key = v.toLowerCase();
    if (v && !seen.has(key)) {
      seen.add(key);
      out.push(v);
    }
  }
  return out;
}

function rows(reg: RegistrationEmail): [string, string][] {
  return [
    ["コース / Course", reg.courseTitle],
    ["開催日 / Date", reg.sessionLabel],
    ["氏名 / Name", reg.fullName],
    ["ふりがな", reg.furigana],
    ["Email", reg.email],
    ["性別 / Gender", reg.gender],
    ["国籍 / Nationality", reg.nationality],
    ["都道府県 / Prefecture", reg.prefecture || "—"],
    ["電話 / Phone", reg.phone || "—"],
    ["きっかけ / Referral", reg.referralSource],
    ["写真掲載 / Photo consent", reg.photoConsent],
  ];
}

function table(reg: RegistrationEmail): string {
  const trs = rows(reg)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px;color:#6b6b6b;white-space:nowrap">${k}</td><td style="padding:6px 12px;color:#1b1c1a">${v}</td></tr>`,
    )
    .join("");
  return `<table style="border-collapse:collapse;font-size:14px">${trs}</table>`;
}

async function send(payload: {
  from: string;
  to: string[];
  subject: string;
  html: string;
  reply_to?: string;
}): Promise<boolean> {
  const res = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return res.ok;
}

/**
 * Send confirmation (to registrant) + notification (to team).
 * No-ops gracefully if RESEND_API_KEY is unset.
 */
export async function sendRegistrationEmails(
  reg: RegistrationEmail,
  extraTeam: string[] = [],
): Promise<{ customer: boolean; team: boolean; skipped?: boolean }> {
  if (!process.env.RESEND_API_KEY) {
    return { customer: false, team: false, skipped: true };
  }
  const from = process.env.RESEND_FROM_EMAIL || DEFAULT_FROM;
  const team = teamEmails(extraTeam);
  const body = table(reg);

  const results = await Promise.allSettled([
    send({
      from,
      to: [reg.email],
      subject: "【自動返信】お申し込みを受け付けました / Registration received",
      html: `<div style="font-family:sans-serif;color:#1b1c1a">
        <p>お申し込みありがとうございます。以下の内容で受け付けました。担当者より追ってご連絡いたします。</p>
        <p style="color:#6b6b6b">Thank you for registering. We received the details below and will contact you shortly.</p>
        ${body}
      </div>`,
      reply_to: team[0],
    }),
    team.length
      ? send({
          from,
          to: team,
          subject: `【新規申込】${reg.courseTitle} / ${reg.fullName}`,
          html: `<div style="font-family:sans-serif;color:#1b1c1a"><p>新しいお申し込みがありました。</p>${body}</div>`,
          reply_to: reg.email,
        })
      : Promise.resolve(false),
  ]);

  return {
    customer: results[0].status === "fulfilled" && results[0].value,
    team: results[1].status === "fulfilled" && results[1].value,
  };
}
