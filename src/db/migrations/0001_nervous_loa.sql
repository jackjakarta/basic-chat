CREATE TABLE IF NOT EXISTS "app"."agent" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"instructions" text,
	"user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "app"."conversation" ADD COLUMN "agent_id" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "app"."agent" ADD CONSTRAINT "agent_user_id_user_entity_id_fk" FOREIGN KEY ("user_id") REFERENCES "app"."user_entity"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "app"."conversation" ADD CONSTRAINT "conversation_agent_id_agent_id_fk" FOREIGN KEY ("agent_id") REFERENCES "app"."agent"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
