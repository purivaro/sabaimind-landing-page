import type { Locale } from "./config";

type Dict = {
  nav: {
    home: string;
    about: string;
    activities: string;
    news: string;
    videos: string;
    contact: string;
  };
  site: {
    name: string;
    tagline: string;
  };
  contact: {
    name: string;
    email: string;
    message: string;
    submit: string;
  };
};

const dictionaries: Record<Locale, Dict> = {
  th: {
    nav: {
      home: "หน้าแรก",
      about: "ข้อมูลองค์กร",
      activities: "กิจกรรม",
      news: "ข่าวสาร",
      videos: "วิดีโอ",
      contact: "ติดต่อเรา",
    },
    site: {
      name: "Sabaimind",
      tagline: "องค์กรเพื่อการพัฒนาจิตใจ",
    },
    contact: {
      name: "ชื่อ",
      email: "อีเมล",
      message: "ข้อความ",
      submit: "ส่งข้อความ",
    },
  },
  ja: {
    nav: {
      home: "ホーム",
      about: "私たちについて",
      activities: "活動",
      news: "お知らせ",
      videos: "動画",
      contact: "お問い合わせ",
    },
    site: {
      name: "Sabaimind",
      tagline: "心の発展のための組織",
    },
    contact: {
      name: "お名前",
      email: "メールアドレス",
      message: "メッセージ",
      submit: "送信",
    },
  },
};

export function getDictionary(locale: Locale): Dict {
  return dictionaries[locale];
}
