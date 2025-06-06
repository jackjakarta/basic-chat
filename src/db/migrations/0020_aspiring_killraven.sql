ALTER TABLE "app"."conversation" ADD COLUMN "assistant_id" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "app"."conversation" ADD CONSTRAINT "conversation_assistant_id_assistant_id_fk" FOREIGN KEY ("assistant_id") REFERENCES "app"."assistant"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
