import type { Locale } from "./config";

// Content reflects the actual organization (NPO法人 Sabai Mind) from sabaimind.or.jp.
// Japanese is canonical; Thai translates with equivalent meaning.

type Program = { icon: string; title: string; body: string };

type Dict = {
  nav: {
    home: string;
    about: string;
    activities: string;
    news: string;
    videos: string;
    blog: string;
    contact: string;
    register: string;
  };
  blog: {
    title: string;
    subtitle: string;
    readMore: string;
    backToList: string;
    empty: string;
  };
  register: {
    title: string;
    subtitle: string;
    courseLabel: string;
    email: string;
    name: string;
    furigana: string;
    gender: string;
    genderFemale: string;
    genderMale: string;
    nationality: string;
    prefecture: string;
    phone: string;
    optional: string;
    sessionDate: string;
    sessionPlaceholder: string;
    noSessions: string;
    referral: string;
    referralOptions: string[];
    photoConsent: string;
    photoAgree: string;
    photoDisagree: string;
    choosePlaceholder: string;
    submit: string;
    submitting: string;
    successTitle: string;
    successBody: string;
    backHome: string;
    errorGeneric: string;
  };
  site: {
    name: string;
    tagline: string;
    footerDescription: string;
    rights: string;
  };
  home: {
    eyebrow: string;
    heroHeadline: string;
    heroSubhead: string;
    ctaPrimary: string;
    featuredActivities: string;
    featuredActivitiesSub: string;
    viewAll: string;
    latestUpdates: string;
    videoTitle: string;
    videoSub: string;
    ctaSectionTitle: string;
    ctaSectionBody: string;
    ctaContact: string;
    ctaActivities: string;
    programsContactBody: string;
    readFullStory: string;
    featuredCourseEyebrow: string;
    featuredCourseCta: string;
    featuredCourseHighlights: string[];
  };
  about: {
    eyebrow: string;
    heroTitle: string;
    heroBody: string;
    heroQuote: string;
    founderName: string;
    founderRole: string;
    sectionMessage: string;
    messageParagraphs: string[];
    sectionAspirations: string;
    mission: { title: string; body: string };
    vision: { title: string; body: string };
    values: { title: string; body: string };
    sectionPrograms: string;
    sectionProgramsSub: string;
    programs: Program[];
    sectionCommunity: string;
    communityCaption: string;
    sectionOrg: string;
    orgFields: { label: string; value: string }[];
    ctaTitle: string;
    ctaBody: string;
    ctaVolunteer: string;
    ctaSupport: string;
  };
  activities: {
    title: string;
    subtitle: string;
    ctaTitle: string;
    ctaBody: string;
    ctaButton: string;
    readMore: string;
    detail: string;
    empty: string;
  };
  news: {
    title: string;
    subtitle: string;
    recentTitle: string;
    newsletterTitle: string;
    newsletterBody: string;
    newsletterPlaceholder: string;
    newsletterCta: string;
    empty: string;
  };
  videos: {
    title: string;
    subtitle: string;
    empty: string;
  };
  contact: {
    title: string;
    subtitle: string;
    sidebarTitle: string;
    addressLine1: string;
    addressLine2: string;
    phone: string;
    email: string;
    followTitle: string;
  };
  footer: {
    explore: string;
    legal: string;
    privacy: string;
    terms: string;
    volunteer: string;
    supportUs: string;
  };
};

const ja: Dict = {
  nav: {
    home: "ホーム",
    about: "私たちについて",
    activities: "活動",
    news: "お知らせ",
    videos: "動画",
    blog: "ブログ",
    contact: "お問い合わせ",
    register: "申し込む",
  },
  blog: {
    title: "ブログ",
    subtitle: "瞑想・タイ文化・活動についての記事",
    readMore: "続きを読む",
    backToList: "ブログ一覧へ戻る",
    empty: "まだ記事がありません。",
  },
  register: {
    title: "お申し込み",
    subtitle: "下記フォームよりお申し込みください。",
    courseLabel: "お申し込みコース",
    email: "メールアドレス",
    name: "氏名",
    furigana: "ふりがな",
    gender: "性別",
    genderFemale: "女",
    genderMale: "男",
    nationality: "国籍",
    prefecture: "お住まいの都道府県",
    phone: "電話番号",
    optional: "任意",
    sessionDate: "開催日",
    sessionPlaceholder: "開催日を選択してください",
    noSessions: "現在お申し込みいただける開催日はありません。",
    referral: "どのようにして Sabai Mind を知りましたか？",
    referralOptions: [
      "リピーター",
      "友人の紹介",
      "Facebook",
      "Instagram",
      "YouTube",
      "Google Map",
      "Google検索",
      "Yahoo！検索",
      "その他",
    ],
    photoConsent: "コース中に撮影した写真の掲載について",
    photoAgree: "同意します",
    photoDisagree: "同意しません",
    choosePlaceholder: "選択してください",
    submit: "この内容で申し込む",
    submitting: "送信中…",
    successTitle: "お申し込みありがとうございます",
    successBody:
      "お申し込みを受け付けました。担当者より追ってご連絡いたします。確認メールもご確認ください。",
    backHome: "ホームに戻る",
    errorGeneric: "送信に失敗しました。時間をおいて再度お試しください。",
  },
  site: {
    name: "Sabai Mind",
    tagline: "瞑想を通じて日本人の心の平安を実現する",
    footerDescription:
      "NPO法人 Sabai Mindは、タイの伝統的なマインドフルネスを日本に届け、現代社会に心の休息の場をつくる活動をしています。",
    rights: "© 2024 NPO法人 Sabai Mind. All rights reserved.",
  },
  home: {
    eyebrow: "NPO法人 Sabai Mind",
    heroHeadline: "Make You Mindful",
    heroSubhead: "瞑想を通じて日本人の心の平安を実現する",
    ctaPrimary: "私たちについて",
    featuredActivities: "私たちの活動",
    featuredActivitiesSub: "タイの智慧と日本の日常をつなぐマインドフルネス",
    viewAll: "すべて見る",
    latestUpdates: "最新のお知らせ",
    videoTitle: "心の平安への、ひと呼吸",
    videoSub: "Sabai Mindの活動と理念を映像でご紹介します。",
    ctaSectionTitle: "心の休息を、日常へ。",
    ctaSectionBody:
      "瞑想指導者派遣・瞑想会・文化イベントに関するご相談、ボランティアやご支援のご希望は、お気軽にご連絡ください。",
    ctaContact: "お問い合わせ",
    ctaActivities: "活動を見る",
    programsContactBody:
      "学校・企業・地域での体験会、瞑想指導者派遣、文化イベントのご相談まで、お気軽にお問い合わせください。",
    readFullStory: "READ MORE",
    featuredCourseEyebrow: "毎週火曜日開催・初心者歓迎",
    featuredCourseCta: "コースの詳細を見る",
    featuredCourseHighlights: [
      "選べる2つの時間帯（午後・夜）",
      "仕事帰りにそのまま参加OK",
      "1回 1,500円・単発参加も歓迎",
    ],
  },
  about: {
    eyebrow: "代表挨拶",
    heroTitle: "穏やかな心で、\n日常を生きる。",
    heroBody:
      "忙しさ、不安、人間関係、将来への迷い。現代社会の中で、私たちの心は知らないうちに疲れをためています。Sabai Mindは、タイの伝統的な瞑想とマインドフルネスを、日常の中で無理なく実践できる形でお伝えしています。",
    heroQuote:
      "宗教の枠を超えて、誰もが日常に取り入れやすい形で。それが Sabai Mind の願いです。",
    founderName: "磯 實  Iso Minoru",
    founderRole: "NPO法人 Sabai Mind 理事長",
    sectionMessage: "代表メッセージ",
    messageParagraphs: [
      "現代の日本は、将来の就職、結婚、老後がどうなるか不透明になっており、自分の将来像を描きにくく、多くの人々は先行きの見えない不安を抱えています。驚くような事件や事象が次々と起こり心が休まらない中で、仕事や家事、育児や介護など、なにかと多忙でストレスの多い社会環境のなかで、心のバランスを崩し、不調に陥る人が増えています。",
      "心の疲れは、特別な人だけに起こるものではありません。だからこそ私たちは、難しい修行ではなく、日常の中で誰もが無理なく取り入れられる「心を休ませる習慣」を大切にしています。",
      "マインドフルネスとは、今の自分の状態に意識を向けて心を整える実践です。仏教の瞑想実践法をルーツとしながら、近年では教育、医療、ビジネスなど幅広い分野で活用されています。Sabai Mindでは、タイの伝統的な瞑想の智慧を、宗教の枠を超えた開かれた学びとして日本に届けてまいります。",
      "そこで私たちは、広く一般市民に対して、タイ式マインドフルネスの普及・啓発に関する事業として、タイ式瞑想を用いた実践会、オンライン実践会、SNS等を利用した情報発信を行い、誰でも気軽にマインドフルネスを知り、学び、体験できる環境を整えてまいります。また、タイ伝統文化を通じた地域交流イベントとして、ソンクラーン祭りやスカイランタン祭り、学校等でのマインドフルネスワークショップを開催し、マインドフルネスを全く知らない方にも、楽しい時間の中で興味を持っていただけるよう工夫してまいります。",
    ],
    sectionAspirations: "私たちの志",
    mission: {
      title: "Mission",
      body: "タイの伝統的なマインドフルネスを日本に広め、日常の中で誰もが心の平安を取り戻せる社会をつくります。",
    },
    vision: {
      title: "Vision",
      body: "予防医療と心のケアの新しい選択肢として、マインドフルネスが当たり前に取り入れられる社会を目指します。",
    },
    values: {
      title: "Values",
      body: "慈悲（Metta）、正念（Sati）、そして中道。宗教の勧誘は一切行わず、誰もが安心して参加できる場を大切にします。",
    },
    sectionPrograms: "事業内容",
    sectionProgramsSub: "三つの柱で、マインドフルネスを社会へ届けます。",
    programs: [
      {
        icon: "self_improvement",
        title: "タイマインドフルネスの普及",
        body: "対面・オンラインの瞑想実践会、学校・企業・地域・児童養護施設でのセミナー、SNSやチラシでの情報発信を通じて、誰もがマインドフルネスに触れられる機会を広げています。",
      },
      {
        icon: "person",
        title: "瞑想指導者派遣",
        body: "長年タイで修行を積んだ僧侶を、学校・企業・病院・地域イベントへ全国どこへでも派遣。日本語・英語・中国語・タイ語に対応します。宗教の勧誘は一切いたしません。",
      },
      {
        icon: "celebration",
        title: "タイ文化を通じた地域交流",
        body: "ソンクラーン祭り（タイの新年・水かけ祭り）、スカイランタン祭り（夜空に願いを放つ祭典）など、文化体験を通じて地域とつながり、心の福祉を育みます。",
      },
    ],
    sectionCommunity: "地域とのつながり",
    communityCaption: "理事長 磯 實 が、川俣 純子 那須烏山市長と面会いたしました。地域との連携を深め、マインドフルネスを通じた社会福祉に取り組んでまいります。",
    sectionOrg: "法人概要",
    orgFields: [
      { label: "法人の名称", value: "特定非営利活動法人 Sabai Mind（サバーイマインド）" },
      { label: "代表者氏名", value: "磯 實（いそ みのる）" },
      { label: "事業所の所在地", value: "〒321-0625 栃木県那須烏山市曲畑1021番地1" },
      { label: "電話", value: "080-3274-8673 / 0287-82-7776" },
      { label: "メールアドレス", value: "support@sabaimind.or.jp" },
    ],
    ctaTitle: "共に、歩んでいきませんか？",
    ctaBody:
      "私たちの活動は、皆様の温かなご支援とボランティアによって支えられています。一歩、心の平穏へと近づく旅に加わってください。",
    ctaVolunteer: "ボランティアに参加する",
    ctaSupport: "活動を支援する",
  },
  activities: {
    title: "活動",
    subtitle:
      "瞑想会、瞑想指導者派遣、ソンクラーン祭やスカイランタン祭など、Sabai Mindの活動をご紹介します。",
    ctaTitle: "ご相談・お申込みはこちら",
    ctaBody:
      "各活動への参加、講師派遣のご依頼、団体での体験会のご相談まで、お気軽にお問い合わせください。",
    ctaButton: "お問い合わせへ",
    readMore: "Read More",
    detail: "Detail",
    empty: "現在予定されている活動はありません。",
  },
  news: {
    title: "News & Insights",
    subtitle:
      "瞑想コースの開催情報、イベント報告、最新の取り組みなどをお届けします。",
    recentTitle: "最新の更新",
    newsletterTitle: "Quiet Thoughts",
    newsletterBody:
      "瞑想のヒント、リトリート情報、月一回のお便りをメールでお届けします。",
    newsletterPlaceholder: "メールアドレス",
    newsletterCta: "登録する",
    empty: "現在ニュースはありません。",
  },
  videos: {
    title: "Videos",
    subtitle: "瞑想ガイドや活動の様子を映像でご紹介します。",
    empty: "動画はまだありません。",
  },
  contact: {
    title: "Contact",
    subtitle:
      "瞑想指導者派遣、瞑想会、文化イベントに関するお問い合わせ、ご支援のご相談などをお寄せください。",
    sidebarTitle: "NPO法人 Sabai Mind",
    addressLine1: "〒321-0625 栃木県那須烏山市曲畑1021番地1",
    addressLine2: "",
    phone: "080-3274-8673 / 0287-82-7776",
    email: "support@sabaimind.or.jp",
    followTitle: "Follow Our Journey",
  },
  footer: {
    explore: "Explore",
    legal: "Legal",
    privacy: "プライバシーポリシー",
    terms: "利用規約",
    volunteer: "ボランティア",
    supportUs: "ご支援",
  },
};

const en: Dict = {
  nav: {
    home: "Home",
    about: "About",
    activities: "Activities",
    news: "News",
    videos: "Videos",
    blog: "Blog",
    contact: "Contact",
    register: "Register",
  },
  blog: {
    title: "Blog",
    subtitle: "Articles on meditation, Thai culture, and our activities",
    readMore: "Read more",
    backToList: "Back to blog",
    empty: "No posts yet.",
  },
  register: {
    title: "Registration",
    subtitle: "Please sign up using the form below.",
    courseLabel: "Course",
    email: "Email",
    name: "Full name",
    furigana: "Furigana (phonetic)",
    gender: "Gender",
    genderFemale: "Female",
    genderMale: "Male",
    nationality: "Nationality",
    prefecture: "Prefecture of residence",
    phone: "Phone number",
    optional: "optional",
    sessionDate: "Session date",
    sessionPlaceholder: "Select a session date",
    noSessions: "There are no upcoming sessions open for registration.",
    referral: "How did you hear about Sabai Mind?",
    referralOptions: [
      "Returning participant",
      "Friend referral",
      "Facebook",
      "Instagram",
      "YouTube",
      "Google Map",
      "Google Search",
      "Yahoo! Search",
      "Other",
    ],
    photoConsent: "Consent to publish photos taken during the course",
    photoAgree: "I agree",
    photoDisagree: "I do not agree",
    choosePlaceholder: "Please choose",
    submit: "Submit registration",
    submitting: "Submitting…",
    successTitle: "Thank you for registering",
    successBody:
      "Your registration has been received. Our team will contact you shortly — please also check your confirmation email.",
    backHome: "Back to home",
    errorGeneric: "Submission failed. Please try again later.",
  },
  site: {
    name: "Sabai Mind",
    tagline: "Bringing peace of mind to Japan through Thai mindfulness",
    footerDescription:
      "Sabai Mind NPO brings traditional Thai mindfulness to Japan, creating spaces of mental rest in modern society.",
    rights: "© 2024 Sabai Mind NPO. All rights reserved.",
  },
  home: {
    eyebrow: "Sabai Mind NPO",
    heroHeadline: "Make You Mindful",
    heroSubhead: "Bringing peace of mind to Japan through Thai mindfulness",
    ctaPrimary: "About Us",
    featuredActivities: "Our Activities",
    featuredActivitiesSub:
      "Connecting Thai wisdom with the everyday life of Japan",
    viewAll: "View All",
    latestUpdates: "Latest Updates",
    videoTitle: "A breath toward inner stillness",
    videoSub: "Discover Sabai Mind through our introduction video.",
    ctaSectionTitle: "Bring rest to your everyday mind.",
    ctaSectionBody:
      "For inquiries about our meditation instructor dispatch, meditation sessions, cultural events — or to volunteer or support us — please feel free to reach out.",
    ctaContact: "Contact Us",
    ctaActivities: "View Activities",
    programsContactBody:
      "For school, workplace, or community sessions, instructor dispatch, or cultural events, please feel free to contact us.",
    readFullStory: "READ MORE",
    featuredCourseEyebrow: "Every Tuesday · Beginners welcome",
    featuredCourseCta: "View course details",
    featuredCourseHighlights: [
      "Two time slots to choose from (afternoon & evening)",
      "Join straight from work",
      "1,500 yen per session · drop-ins welcome",
    ],
  },
  about: {
    eyebrow: "Message from the Representative",
    heroTitle: "Live each day\nwith a peaceful mind.",
    heroBody:
      "Busyness, uncertainty, relationships, and worries about the future can quietly tire the mind. Sabai Mind shares traditional Thai meditation and mindfulness in a form that can be practiced gently in everyday life.",
    heroQuote:
      "Beyond the bounds of religion, in a form everyone can incorporate into daily life — that is the wish of Sabai Mind.",
    founderName: "Iso Minoru  磯 實",
    founderRole: "Chairman, Sabai Mind NPO",
    sectionMessage: "Message from the Chairman",
    messageParagraphs: [
      "In modern Japan, the future of employment, marriage, and retirement is increasingly uncertain. Many people find it difficult to picture their own future and carry the weight of unseen anxieties. Amid a stream of unsettling events and the demands of work, household, childcare, and elder care, more and more people are losing their inner balance and falling into mental distress.",
      "Tiredness of the heart is not something that happens only to certain people. That is why we value not difficult training, but simple habits of resting the mind that anyone can bring into daily life.",
      "Mindfulness is the practice of gently noticing the present state of one's body and mind. Rooted in Buddhist meditation practice, it is now used in many fields, including education, healthcare, and business. Sabai Mind brings the wisdom of traditional Thai meditation to Japan as an open form of learning beyond the bounds of religion.",
      "We therefore offer the general public a way to approach Thai-style mindfulness through in-person and online practice sessions and information shared on social media — creating an environment where anyone can learn and experience mindfulness with ease. We also host community events rooted in traditional Thai culture, such as the Songkran Festival, the Sky Lantern Festival, and mindfulness workshops in schools — so even those unfamiliar with mindfulness can encounter it through joyful moments.",
    ],
    sectionAspirations: "Our Aspirations",
    mission: {
      title: "Mission",
      body: "To bring traditional Thai mindfulness to Japan and build a society where everyone can recover peace of mind in daily life.",
    },
    vision: {
      title: "Vision",
      body: "A society where mindfulness is naturally embraced as a new option for preventive medicine and mental care.",
    },
    values: {
      title: "Values",
      body: "Compassion (Metta), mindful awareness (Sati), and the Middle Way. We never proselytize and welcome everyone to participate with peace of mind.",
    },
    sectionPrograms: "Our Programs",
    sectionProgramsSub:
      "Three pillars that bring mindfulness to society.",
    programs: [
      {
        icon: "self_improvement",
        title: "Promoting Thai Mindfulness",
        body: "Through in-person and online meditation sessions, seminars at schools, companies, communities, and children's homes, and outreach via social media and print, we widen the opportunities for everyone to encounter mindfulness.",
      },
      {
        icon: "person",
        title: "Meditation Instructor Dispatch",
        body: "We send Thai monks with years of meditation training to schools, companies, hospitals, and community events — anywhere in Japan. Available in Japanese, English, Chinese, and Thai. We never proselytize.",
      },
      {
        icon: "celebration",
        title: "Community Exchange Through Thai Culture",
        body: "Songkran (the Thai New Year water festival), the Sky Lantern Festival (releasing wishes into the night sky), and other cultural experiences strengthen ties with the local community and nurture mental well-being.",
      },
    ],
    sectionCommunity: "Connection with the Community",
    communityCaption:
      "Chairman Iso Minoru met with Mayor Junko Kawamata of Nasukarasuyama City, deepening ties with the region and committing to social welfare through mindfulness.",
    sectionOrg: "Organization",
    orgFields: [
      { label: "Name", value: "Specified Non-Profit Corporation Sabai Mind" },
      { label: "Representative", value: "Iso Minoru" },
      {
        label: "Address",
        value: "1021-1 Kuruhata, Nasukarasuyama, Tochigi 321-0625, Japan",
      },
      { label: "Phone", value: "+81-80-3274-8673 / +81-287-82-7776" },
      { label: "Email", value: "support@sabaimind.or.jp" },
    ],
    ctaTitle: "Walk this path with us.",
    ctaBody:
      "Our work is sustained by the warm support and volunteer hours of our community. Take a step closer to inner peace — join us on the journey.",
    ctaVolunteer: "Become a Volunteer",
    ctaSupport: "Support Our Work",
  },
  activities: {
    title: "Activities",
    subtitle:
      "Meditation sessions, instructor dispatch, the Songkran Festival and the Sky Lantern Festival — explore everything Sabai Mind does.",
    ctaTitle: "Inquiries & Registration",
    ctaBody:
      "Whether you'd like to join an event, request an instructor, or arrange a session for your organization — please get in touch anytime.",
    ctaButton: "Go to Contact",
    readMore: "Read More",
    detail: "Detail",
    empty: "There are no scheduled activities at the moment.",
  },
  news: {
    title: "News & Insights",
    subtitle:
      "Meditation course announcements, event reports, and the latest updates from our work.",
    recentTitle: "Recent Updates",
    newsletterTitle: "Quiet Thoughts",
    newsletterBody:
      "Receive monthly meditation tips, retreat news, and reflections delivered to your inbox.",
    newsletterPlaceholder: "Email address",
    newsletterCta: "Subscribe",
    empty: "No news at the moment.",
  },
  videos: {
    title: "Videos",
    subtitle:
      "Meditation guides and glimpses of our activities, in video form.",
    empty: "No videos yet.",
  },
  contact: {
    title: "Contact",
    subtitle:
      "Reach out about meditation instructor dispatch, meditation sessions, cultural events, or how to support us.",
    sidebarTitle: "Sabai Mind NPO",
    addressLine1: "1021-1 Kuruhata, Nasukarasuyama, Tochigi 321-0625, Japan",
    addressLine2: "",
    phone: "+81-80-3274-8673 / +81-287-82-7776",
    email: "support@sabaimind.or.jp",
    followTitle: "Follow Our Journey",
  },
  footer: {
    explore: "Explore",
    legal: "Legal",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    volunteer: "Volunteer",
    supportUs: "Support Us",
  },
};

const dictionaries: Record<Locale, Dict> = { ja, en };

export function getDictionary(locale: Locale): Dict {
  return dictionaries[locale];
}
