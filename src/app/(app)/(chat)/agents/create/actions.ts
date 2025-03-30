'use server';

import { dbInsertAgent } from '@/db/functions/agent';
import { type AgentRow } from '@/db/schema';
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

    return newAgent;
  } catch (error) {
    console.error({ error });
    throw error;
  }
}
