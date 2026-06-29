ALTER TABLE "users" ADD COLUMN "notify_registrations" boolean DEFAULT false NOT NULL;--> statement-breakpoint
-- Seed the registration-notification team. No admin permissions — they only
-- receive the new-registration email. Idempotent; admins can edit/remove these
-- from the Users page. ON CONFLICT keeps any existing row's permissions intact.
INSERT INTO "users" ("email", "name", "notify_registrations") VALUES
	('chalapinyo@meisounomori.com', 'chalapinyo', true),
	('preewsiha@gmail.com', 'preewsiha', true),
	('chiemi.mmc01@gmail.com', 'chiemi', true),
	('yam.may.1904@gmail.com', 'yam.may', true)
ON CONFLICT ("email") DO UPDATE SET "notify_registrations" = true;