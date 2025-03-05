import { dbGetAgentById } from '@/db/functions/agent';
import { dbInsertEmbeddings, dbInsertResource } from '@/db/functions/rag';
import { type InsertAgentResourceRow } from '@/db/schema';
import { generateEmbeddings } from '@/utils/embeddings';

export async function createResource({
  content,
  agentId,
  userId,
}: {
  content: string;
  agentId: string;
  userId: string;
}) {
  try {
    const agent = await dbGetAgentById({ agentId, userId });

    if (agent === undefined) {
      throw new Error('Agent not found');
    }

    const newResource = await dbInsertResource({
      agentId: agent.id,
      content,
    });

    if (newResource === undefined) {
      throw new Error('Failed to create resource');
    }

    const embeddings = await generateEmbeddings(newResource.content);

    const insertEmbeddingsMap = embeddings.map((embedding) => ({
      agentResourceId: newResource.id,
      ...embedding,
    }));

    await dbInsertEmbeddings(insertEmbeddingsMap);

    return 'Resource successfully created and embedded.';
  } catch (error) {
    return error instanceof Error && error.message.length > 0
      ? error.message
      : 'Error, please try again.';
  }
}
