DO $$ BEGIN
 CREATE TYPE "app"."data_source_integration_state" AS ENUM('active', 'comingSoon');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "app"."data_source_integration_type" AS ENUM('notion');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "app"."data_source_integration" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"type" "app"."data_source_integration_type" NOT NULL,
	"state" "app"."data_source_integration_state" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "app"."data_source_integration_user_mapping" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"data_source_integration_id" uuid NOT NULL,
	"enabled" boolean DEFAULT false NOT NULL,
	"oauth_metadata" json NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "data_source_integration_user_mapping_user_id_data_source_integration_id_unique" UNIQUE("user_id","data_source_integration_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "app"."data_source_integration_user_mapping" ADD CONSTRAINT "data_source_integration_user_mapping_user_id_user_entity_id_fk" FOREIGN KEY ("user_id") REFERENCES "app"."user_entity"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "app"."data_source_integration_user_mapping" ADD CONSTRAINT "data_source_integration_user_mapping_data_source_integration_id_data_source_integration_id_fk" FOREIGN KEY ("data_source_integration_id") REFERENCES "app"."data_source_integration"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
