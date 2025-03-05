import { and, desc, eq } from 'drizzle-orm';

import { db } from '..';
import {
  agentResourceTable,
  agentTable,
  embeddingsTable,
  type AgentResourceRow,
  type EmbeddingsRow,
  type InsertAgentResourceRow,
  type InsertEmbeddingsRow,
} from '../schema';

export async function dbInsertResource(resource: InsertAgentResourceRow) {
  const newResource = (await db.insert(agentResourceTable).values(resource).returning())[0];

  return newResource;
}

export async function dbInsertEmbeddings(embeddings: InsertEmbeddingsRow[]) {
  const newEmbeddings = (await db.insert(embeddingsTable).values(embeddings).returning())[0];

  return newEmbeddings;
}
