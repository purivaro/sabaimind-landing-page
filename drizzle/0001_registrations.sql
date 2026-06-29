CREATE TABLE "registrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"course_slug" text DEFAULT 'utsunomiya-meditation-course' NOT NULL,
	"session_date" text NOT NULL,
	"email" text NOT NULL,
	"full_name" text NOT NULL,
	"furigana" text NOT NULL,
	"gender" text NOT NULL,
	"nationality" text NOT NULL,
	"prefecture" text,
	"phone" text,
	"referral_source" text NOT NULL,
	"photo_consent" text NOT NULL,
	"locale" text DEFAULT 'ja' NOT NULL,
	"handled" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_registrations_session" ON "registrations" USING btree ("session_date");--> statement-breakpoint
CREATE INDEX "idx_registrations_created" ON "registrations" USING btree ("created_at");