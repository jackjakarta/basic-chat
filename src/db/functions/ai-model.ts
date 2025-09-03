import { db } from '@/db';
import { and, desc, eq } from 'drizzle-orm';

import { aiModelTable } from '../schema';

export async function dbGetAllTextModels() {
  const models = await db
    .select()
    .from(aiModelTable)
    .where(eq(aiModelTable.type, 'text'))
    .orderBy(desc(aiModelTable.name));

  return models;
}

export async function dbGetAllImageModels() {
  const models = await db
    .select()
    .from(aiModelTable)
    .where(eq(aiModelTable.type, 'image'))
    .orderBy(desc(aiModelTable.name));

  return models;
}

export async function dbGetEnabledModels() {
  const models = await db
    .select()
    .from(aiModelTable)
    .where(and(eq(aiModelTable.isEnabled, true), eq(aiModelTable.type, 'text')))
    .orderBy(desc(aiModelTable.name));

  return models;
}

export async function dbGetEnabledImageModels() {
  const models = await db
    .select()
    .from(aiModelTable)
    .where(and(eq(aiModelTable.isEnabled, true), eq(aiModelTable.type, 'image')))
    .orderBy(desc(aiModelTable.name));

  return models;
}

export async function dbGetEnabledModelById({ modelId }: { modelId: string }) {
  const [model] = await db
    .select()
    .from(aiModelTable)
    .where(
      and(
        eq(aiModelTable.id, modelId),
        eq(aiModelTable.isEnabled, true),
        eq(aiModelTable.type, 'text'),
      ),
    );

  return model;
}

export async function dbUpdateModelEnabledStatus({
  modelId,
  isEnabled,
}: {
  modelId: string;
  isEnabled: boolean;
}) {
  const [updatedModel] = await db
    .update(aiModelTable)
    .set({ isEnabled })
    .where(eq(aiModelTable.id, modelId))
    .returning();

  return updatedModel;
}
