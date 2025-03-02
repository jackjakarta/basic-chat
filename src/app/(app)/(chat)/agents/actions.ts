'use server';

import { dbInsertAgent } from '@/db/functions/agent';
import { type AgentRow } from '@/db/schema';
import { getUser } from '@/utils/auth';
import * as Sentry from '@sentry/nextjs';
import { z } from 'zod';

import { newAgentSchema } from './_components/create-agent-button';

type CreateAgentRequestBody = z.infer<typeof newAgentSchema>;

export async function createAgentAction(body: CreateAgentRequestBody): Promise<AgentRow> {
  const parsedData = newAgentSchema.safeParse(body);

  if (!parsedData.success) {
    throw new Error('Invalid data');
  }

  try {
    const user = await getUser();
    const newAgent = await dbInsertAgent({ ...parsedData.data, userId: user.id });

    if (newAgent === undefined) {
      throw new Error('Failed to create agent');
    }

    return newAgent;
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
}
