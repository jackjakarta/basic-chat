CREATE TABLE IF NOT EXISTS "app"."file_embedding_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"file_id" uuid NOT NULL,
	"embedding" vector(1536) NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "app"."folder" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "app"."ai_model" ADD COLUMN "features" jsonb DEFAULT '{"vision":true,"files":true}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "app"."file" ADD COLUMN "content" text;--> statement-breakpoint
ALTER TABLE "app"."file" ADD COLUMN "folder_id" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "app"."file_embedding_table" ADD CONSTRAINT "file_embedding_table_file_id_file_id_fk" FOREIGN KEY ("file_id") REFERENCES "app"."file"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "app"."folder" ADD CONSTRAINT "folder_user_id_user_entity_id_fk" FOREIGN KEY ("user_id") REFERENCES "app"."user_entity"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "embeddingIndex" ON "app"."file_embedding_table" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "app"."file" ADD CONSTRAINT "file_folder_id_folder_id_fk" FOREIGN KEY ("folder_id") REFERENCES "app"."folder"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
