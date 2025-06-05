'use server';

import { dbInsertAssistant, dbSetAssistantVectorStoreId } from '@/db/functions/assistant';
import { type AssistantRow } from '@/db/schema';
import { createVectorStore } from '@/openai/files';
import { getUser } from '@/utils/auth';
import { z } from 'zod';

export const newAssistantSchema = z.object({
  name: z.string().min(1, 'Assistant name is required'),
  instructions: z.string().min(1, 'Instructions are required'),
});

type CreateAssistantRequestBody = z.infer<typeof newAssistantSchema>;

export async function createAssistantAction(
  body: CreateAssistantRequestBody,
): Promise<AssistantRow> {
  const user = await getUser();
  const parsedData = newAssistantSchema.safeParse(body);

  if (!parsedData.success) {
    throw new Error('Invalid data');
  }

  try {
    const newAssistant = await dbInsertAssistant({ ...parsedData.data, userId: user.id });

    if (newAssistant === undefined) {
      throw new Error('Failed to create assistant');
    }

    const vectorStore = await createVectorStore({
      assistantId: newAssistant.id,
    });

    const updatedAssistant = await dbSetAssistantVectorStoreId({
      assistantId: newAssistant.id,
      userId: user.id,
      vectorStoreId: vectorStore.id,
    });

    if (updatedAssistant === undefined) {
      throw new Error('Failed to update assistant with vector store ID');
    }

    return updatedAssistant;
  } catch (error) {
    console.error({ error });
    throw error;
  }
}
