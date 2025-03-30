'use server';

import { dbInsertAgent } from '@/db/functions/agent';
import { type AgentRow } from '@/db/schema';
import { getUser } from '@/utils/auth';
import { z } from 'zod';

export const requestSchema = z.object({
  name: z.string().min(1, 'Agent name is required'),
  instructions: z.string().min(1, 'Instructions are required'),
});

type CreateAgentRequestBody = z.infer<typeof requestSchema>;

export async function createAgentAction(body: CreateAgentRequestBody): Promise<AgentRow> {
  const user = await getUser();
  const parsedData = requestSchema.safeParse(body);

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
