DO $$ BEGIN
 CREATE TYPE "app"."auth_provider" AS ENUM('credentials', 'github');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "app"."user_entity" ADD COLUMN "auth_provider" "app"."auth_provider" NOT NULL;