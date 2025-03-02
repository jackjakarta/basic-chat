'use server';

import { dbDeleteAgent, dbUpdateAgent } from '@/db/functions/agent';
import { type AgentRow } from '@/db/schema';
import { getUser } from '@/utils/auth';
import * as Sentry from '@sentry/nextjs';

export async function updateAgentAction({
  agentId,
  data,
}: {
  agentId: string;
  data: Partial<AgentRow>;
}) {
  try {
    const user = await getUser();
    const updatedAgent = await dbUpdateAgent({ agentId, userId: user.id, data });

    if (updatedAgent === undefined) {
      throw new Error('Failed to update agent');
    }

    return updatedAgent;
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
}

export async function deleteAgentAction({ agentId }: { agentId: string }) {
  try {
    const user = await getUser();
    await dbDeleteAgent({ agentId, userId: user.id });
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
}
