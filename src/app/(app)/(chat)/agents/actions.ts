'use server';

import { dbInsertAgent } from '@/db/functions/agent';
import { type InsertAgentRow } from '@/db/schema';
import { getUser } from '@/utils/auth';
import * as Sentry from '@sentry/nextjs';

export async function createAgentAction(data: Omit<InsertAgentRow, 'userId'>) {
  try {
    const user = await getUser();
    const newAgent = await dbInsertAgent({ ...data, userId: user.id });

    if (newAgent === undefined) {
      throw new Error('Failed to create agent');
    }

    return newAgent;
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
}
