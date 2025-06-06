ALTER TABLE "app"."conversation" DROP CONSTRAINT "conversation_agent_id_agent_id_fk";
--> statement-breakpoint
ALTER TABLE "app"."conversation" DROP COLUMN IF EXISTS "agent_id";