'use server';

import { dbInsertAgent, dbSetAgentVectorStoreId, dbUpdateAgent } from '@/db/functions/agent';
import { type AgentRow } from '@/db/schema';
import { createVectorStore } from '@/openai/files';
import { getUser } from '@/utils/auth';
import { z } from 'zod';

import { newAgentSchema } from './schemas';

type CreateAgentRequestBody = z.infer<typeof newAgentSchema>;

export async function createAgentAction(body: CreateAgentRequestBody): Promise<AgentRow> {
  const user = await getUser();
  const parsedData = newAgentSchema.safeParse(body);

  if (!parsedData.success) {
    throw new Error('Invalid data');
  }

  try {
    const newAgent = await dbInsertAgent({ ...parsedData.data, userId: user.id });

    if (newAgent === undefined) {
      throw new Error('Failed to create agent');
    }

    const vectorStore = await createVectorStore({
      agentId: newAgent.id,
    });

    const updatedAgent = await dbSetAgentVectorStoreId({
      agentId: newAgent.id,
      userId: user.id,
      vectorStoreId: vectorStore.id,
    });

    if (updatedAgent === undefined) {
      throw new Error('Failed to update agent with vector store ID');
    }

    return updatedAgent;
  } catch (error) {
    console.error({ error });
    throw error;
  }
}
