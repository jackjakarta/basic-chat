CREATE TABLE IF NOT EXISTS "app"."file_embedding" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"file_id" uuid NOT NULL,
	"embedding" vector(1536) NOT NULL,
	"chunk_text" text NOT NULL,
	"chunk_index" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "app"."file" ADD COLUMN "content" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "app"."file_embedding" ADD CONSTRAINT "file_embedding_file_id_file_id_fk" FOREIGN KEY ("file_id") REFERENCES "app"."file"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "file_embedding_file_id_chunk_index_index" ON "app"."file_embedding" USING btree ("file_id","chunk_index");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "embeddingIndex" ON "app"."file_embedding" USING hnsw ("embedding" vector_cosine_ops);