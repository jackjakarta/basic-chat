CREATE EXTENSION IF NOT EXISTS vector;

CREATE SCHEMA "app";
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "app"."conversation_role" AS ENUM('user', 'assistant', 'system');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "app"."token_action" AS ENUM('verify-email', 'reset-password');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "app"."conversation_message" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content" text NOT NULL,
	"conversation_id" uuid NOT NULL,
	"user_id" uuid,
	"role" "app"."conversation_role" NOT NULL,
	"order_number" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "app"."conversation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "app"."action_token" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"action" "app"."token_action" NOT NULL,
	"token" text NOT NULL,
	"email" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "action_token_email_action_unique" UNIQUE("email","action")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "app"."user_entity" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"password_hash" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_entity_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "app"."conversation_message" ADD CONSTRAINT "conversation_message_conversation_id_conversation_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "app"."conversation"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "app"."conversation_message" ADD CONSTRAINT "conversation_message_user_id_user_entity_id_fk" FOREIGN KEY ("user_id") REFERENCES "app"."user_entity"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "app"."conversation" ADD CONSTRAINT "conversation_user_id_user_entity_id_fk" FOREIGN KEY ("user_id") REFERENCES "app"."user_entity"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
