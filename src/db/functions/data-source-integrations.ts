import { type OAuthTokenMetadata } from '@/app/api/auth/notion/types';
import { eq } from 'drizzle-orm';

import { db } from '..';
import {
  DataSourceIntegrationModel,
  dataSourceIntegrationTable,
  DataSourceIntegrationUserMappingInsertModel,
  dataSourceIntegrationUserMappingTable,
} from '../schema';

export async function dbGetAllDataSourceIntegrations() {
  return await db.select().from(dataSourceIntegrationTable);
}

export type ActiveIntegration = DataSourceIntegrationModel & {
  enabled: boolean;
  oauthMetadata: OAuthTokenMetadata;
  mappingId: string;
};

export async function dbGetAllActiveDataSourcesByUserId({
  userId,
}: {
  userId: string;
}): Promise<ActiveIntegration[]> {
  const activeIntegrations = await db
    .select()
    .from(dataSourceIntegrationUserMappingTable)
    .innerJoin(
      dataSourceIntegrationTable,
      eq(
        dataSourceIntegrationUserMappingTable.dataSourceIntegrationId,
        dataSourceIntegrationTable.id,
      ),
    )
    .where(eq(dataSourceIntegrationUserMappingTable.userId, userId))
    .orderBy(dataSourceIntegrationTable.createdAt);

  return activeIntegrations.map((a) => ({
    ...a.data_source_integration,
    enabled: a.data_source_integration_user_mapping.enabled,
    mappingId: a.data_source_integration_user_mapping.id,
    oauthMetadata: a.data_source_integration_user_mapping.oauthMetadata,
  }));
}

export async function dbUpsertActiveIntegration(
  value: DataSourceIntegrationUserMappingInsertModel,
) {
  const [updated] = await db
    .insert(dataSourceIntegrationUserMappingTable)
    .values(value)
    .onConflictDoUpdate({
      target: [
        dataSourceIntegrationUserMappingTable.userId,
        dataSourceIntegrationUserMappingTable.dataSourceIntegrationId,
      ],
      set: {
        oauthMetadata: value.oauthMetadata,
        enabled: value.enabled,
      },
    });

  return updated;
}

export async function dbUpdateActiveIntegration(
  value: Partial<DataSourceIntegrationUserMappingInsertModel> & { id: string },
) {
  try {
    const [updated] = await db
      .update(dataSourceIntegrationUserMappingTable)
      .set({ ...value })
      .where(eq(dataSourceIntegrationUserMappingTable.id, value.id))
      .returning();

    return updated;
  } catch (error) {
    console.error({ error });
  }
}
