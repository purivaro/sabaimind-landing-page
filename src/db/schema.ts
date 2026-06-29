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

export type Author = typeof authors.$inferSelect;
export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;
export type Registration = typeof registrations.$inferSelect;
