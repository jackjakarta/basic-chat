CREATE TABLE IF NOT EXISTS "app"."chat_project" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"system_prompt" text,
	"user_id" uuid NOT NULL,
	"icon" text NOT NULL,
	"icon_color" text DEFAULT 'grey' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "app"."conversation" ADD COLUMN "chat_project_id" uuid;--> statement-breakpoint
ALTER TABLE "app"."conversation" ADD COLUMN "is_pinned" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "app"."file" ADD COLUMN "chat_project_id" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "app"."chat_project" ADD CONSTRAINT "chat_project_user_id_user_entity_id_fk" FOREIGN KEY ("user_id") REFERENCES "app"."user_entity"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "app"."conversation" ADD CONSTRAINT "conversation_chat_project_id_chat_project_id_fk" FOREIGN KEY ("chat_project_id") REFERENCES "app"."chat_project"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "app"."file" ADD CONSTRAINT "file_chat_project_id_chat_project_id_fk" FOREIGN KEY ("chat_project_id") REFERENCES "app"."chat_project"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
