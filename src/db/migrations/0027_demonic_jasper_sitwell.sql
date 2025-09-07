ALTER TABLE "app"."file_embedding" ADD COLUMN "page_number" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "app"."file_embedding" ADD COLUMN "token_count" integer;--> statement-breakpoint
ALTER TABLE "app"."file_embedding" ADD COLUMN "content_hash" text;