CREATE TABLE IF NOT EXISTS "app"."file_embedding_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"file_id" uuid NOT NULL,
	"embedding" vector(1536) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "app"."file_embedding_table" ADD CONSTRAINT "file_embedding_table_file_id_file_id_fk" FOREIGN KEY ("file_id") REFERENCES "app"."file"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "embeddingIndex" ON "app"."file_embedding_table" USING hnsw ("embedding" vector_cosine_ops);