import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  boolean,
  index,
} from "drizzle-orm/pg-core";

/**
 * Authors = people who can write posts. One row is upserted per Google
 * account on first sign-in (see auth). Admin gating is done by an email
 * allowlist in env, not stored here.
 */
export const authors = pgTable("authors", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  avatar: text("avatar"),
  bio: text("bio"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Blog posts. `body` is Markdown. `locale` mirrors the site locales (ja|en)
 * so the public blog can be listed per language.
 */
export const articles = pgTable(
  "articles",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    locale: text("locale").notNull().default("ja"),
    title: text("title").notNull(),
    body: text("body").notNull(),
    excerpt: text("excerpt"),
    coverImage: text("cover_image"),
    // 'draft' | 'published'
    status: text("status").notNull().default("draft"),
    authorId: integer("author_id").references(() => authors.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
  },
  (t) => [
    index("idx_articles_status").on(t.status),
    index("idx_articles_locale").on(t.locale),
    index("idx_articles_published").on(t.publishedAt),
  ],
);

/**
 * Event/course registrations (simplified signup form). One course is open at a
 * time (utsunomiya-meditation-course); `sessionDate` is the chosen session
 * (ISO date, e.g. 2026-07-07). Past sessions are hidden on the form by date.
 */
export const registrations = pgTable(
  "registrations",
  {
    id: serial("id").primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    courseSlug: text("course_slug")
      .notNull()
      .default("utsunomiya-meditation-course"),
    sessionDate: text("session_date").notNull(), // ISO date of the chosen 開催日
    email: text("email").notNull(),
    fullName: text("full_name").notNull(),
    furigana: text("furigana").notNull(),
    gender: text("gender").notNull(), // 女 | 男
    nationality: text("nationality").notNull(),
    prefecture: text("prefecture"),
    phone: text("phone"),
    referralSource: text("referral_source").notNull(),
    photoConsent: text("photo_consent").notNull(), // agree | disagree
    locale: text("locale").notNull().default("ja"),
    handled: boolean("handled").notNull().default(false),
  },
  (t) => [
    index("idx_registrations_session").on(t.sessionDate),
    index("idx_registrations_created").on(t.createdAt),
  ],
);

/**
 * Admin users. One row per person who may access the admin panel. Sign-in is
 * Google-only (see auth); a row must exist (or the email be in ADMIN_EMAILS) for
 * access. Permissions are explicit, independent flags — there is no single role:
 *   - isAdmin                 full access, incl. user management
 *   - blogRole                'none' | 'writer' | 'editor' | 'director'
 *   - canManageRegistrations  view / export / handle course registrations
 *   - canManageCourseDates    manage course dates (cohorts)
 * `authorId` links the byline (authors row, 1:1) edited from the Users page.
 */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  avatar: text("avatar"),
  authorId: integer("author_id").references(() => authors.id, {
    onDelete: "set null",
  }),
  isActive: boolean("is_active").notNull().default(true),
  isAdmin: boolean("is_admin").notNull().default(false),
  // 'none' | 'writer' | 'editor' | 'director'
  blogRole: text("blog_role").notNull().default("none"),
  canManageRegistrations: boolean("can_manage_registrations")
    .notNull()
    .default(false),
  canManageCourseDates: boolean("can_manage_course_dates")
    .notNull()
    .default(false),
  // Receive an email whenever someone registers for an event (independent of
  // any admin permission — a recipient need not manage anything).
  notifyRegistrations: boolean("notify_registrations").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Course dates = the selectable cohorts shown on the registration form, managed
 * from the admin. Each row is one selectable option. `value` is the stable token
 * stored in registrations.session_date. `date` (ISO, Asia/Tokyo) drives
 * past-hiding on the public form; rows with a null date never auto-hide.
 */
export const courseDates = pgTable(
  "course_dates",
  {
    id: serial("id").primaryKey(),
    value: text("value").notNull().unique(),
    date: text("date"), // ISO yyyy-mm-dd (Asia/Tokyo), nullable
    labelJa: text("label_ja").notNull(),
    labelEn: text("label_en"),
    courseSlug: text("course_slug")
      .notNull()
      .default("utsunomiya-meditation-course"),
    sortOrder: integer("sort_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("idx_course_dates_active").on(t.isActive),
    index("idx_course_dates_date").on(t.date),
  ],
);

export type Author = typeof authors.$inferSelect;
export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;
export type Registration = typeof registrations.$inferSelect;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type CourseDate = typeof courseDates.$inferSelect;
export type NewCourseDate = typeof courseDates.$inferInsert;
