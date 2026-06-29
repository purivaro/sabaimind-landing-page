CREATE TABLE "course_dates" (
	"id" serial PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"date" text,
	"label_ja" text NOT NULL,
	"label_en" text,
	"course_slug" text DEFAULT 'utsunomiya-meditation-course' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "course_dates_value_unique" UNIQUE("value")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"avatar" text,
	"author_id" integer,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_admin" boolean DEFAULT false NOT NULL,
	"blog_role" text DEFAULT 'none' NOT NULL,
	"can_manage_registrations" boolean DEFAULT false NOT NULL,
	"can_manage_course_dates" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_course_dates_active" ON "course_dates" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_course_dates_date" ON "course_dates" USING btree ("date");--> statement-breakpoint
-- Seed the initial cohorts (mirrors the previously hardcoded courseSessions.ts).
-- Idempotent: ON CONFLICT keeps any admin edits on re-run.
INSERT INTO "course_dates" ("value", "date", "label_ja", "label_en", "sort_order") VALUES
	('2026-05-26#evening', '2026-05-26', '5月26日（火） 夜 19:30〜21:00', 'Tue, May 26 · Evening 19:30–21:00', 10),
	('2026-06-09#evening', '2026-06-09', '6月9日（火） 夜 19:30〜21:00', 'Tue, Jun 9 · Evening 19:30–21:00', 20),
	('2026-06-16#evening', '2026-06-16', '6月16日（火） 夜 19:30〜21:00', 'Tue, Jun 16 · Evening 19:30–21:00', 30),
	('2026-06-23#evening', '2026-06-23', '6月23日（火） 夜 19:30〜21:00', 'Tue, Jun 23 · Evening 19:30–21:00', 40),
	('2026-07-07#afternoon', '2026-07-07', '7月7日（火） 午後 14:30〜16:00', 'Tue, Jul 7 · Afternoon 14:30–16:00', 50),
	('2026-07-07#evening', '2026-07-07', '7月7日（火） 夜 19:30〜21:00', 'Tue, Jul 7 · Evening 19:30–21:00', 60),
	('2026-07-21#afternoon', '2026-07-21', '7月21日（火） 午後 14:30〜16:00', 'Tue, Jul 21 · Afternoon 14:30–16:00', 70),
	('2026-07-21#evening', '2026-07-21', '7月21日（火） 夜 19:30〜21:00', 'Tue, Jul 21 · Evening 19:30–21:00', 80),
	('2026-07-28#afternoon', '2026-07-28', '7月28日（火） 午後 14:30〜16:00', 'Tue, Jul 28 · Afternoon 14:30–16:00', 90),
	('2026-07-28#evening', '2026-07-28', '7月28日（火） 夜 19:30〜21:00', 'Tue, Jul 28 · Evening 19:30–21:00', 100),
	('2026-08-04#afternoon', '2026-08-04', '8月4日（火） 午後 14:30〜16:00', 'Tue, Aug 4 · Afternoon 14:30–16:00', 110),
	('2026-08-04#evening', '2026-08-04', '8月4日（火） 夜 19:30〜21:00', 'Tue, Aug 4 · Evening 19:30–21:00', 120)
ON CONFLICT ("value") DO NOTHING;