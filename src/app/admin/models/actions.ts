'use server';

import { dbUpdateModelEnabledStatus } from '@/db/functions/ai-model';
import { getUser } from '@/utils/auth';

export async function updateModelEnabledAction({
  modelId,
  isEnabled,
}: {
  modelId: string;
  isEnabled: boolean;
}) {
  const user = await getUser();

  if (!user.isSuperAdmin) {
    throw new Error('Unauthorized: Only super admins can update model status');
  }

  const updatedModel = await dbUpdateModelEnabledStatus({
    modelId,
    isEnabled,
  });

  return updatedModel;
}
