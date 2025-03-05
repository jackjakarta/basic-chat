import { db } from '@/db';
import { embeddingsTable } from '@/db/schema';
import { openai } from '@ai-sdk/openai';
import { embed, embedMany } from 'ai';
import { cosineDistance, desc, gt, sql } from 'drizzle-orm';

const embeddingModel = openai.embedding('text-embedding-ada-002');

export async function generateEmbeddings(value: string) {
  const chunks = generateChunks(value);
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });

  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
}

function generateChunks(input: string): string[] {
  return input
    .trim()
    .split('.')
    .filter((i) => i !== '');
}

export async function generateEmbedding(value: string): Promise<number[]> {
  const input = value.replaceAll('\\n', ' ');
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  });
  return embedding;
}

export async function findRelevantContent(userQuery: string) {
  const userQueryEmbedded = await generateEmbedding(userQuery);
  const similarity = sql<number>`1 - (${cosineDistance(embeddingsTable.embedding, userQueryEmbedded)})`;
  const similarGuides = await db
    .select({ name: embeddingsTable.content, similarity })
    .from(embeddingsTable)
    .where(gt(similarity, 0.5))
    .orderBy((t) => desc(t.similarity))
    .limit(4);
  return similarGuides;
}
