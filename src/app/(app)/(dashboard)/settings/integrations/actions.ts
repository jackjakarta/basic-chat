'use server';

import { db } from '@/db';
import { dataSourceIntegrationUserMappingTable } from '@/db/schema';
import { getUser } from '@/utils/auth';
import { and, eq } from 'drizzle-orm';

export async function removeDataSourceIntegrationAction({
  dataSourceIntegrationId,
}: {
  dataSourceIntegrationId: string;
}) {
  const user = await getUser();

  const [deleted] = await db
    .delete(dataSourceIntegrationUserMappingTable)
    .where(
      and(
        eq(dataSourceIntegrationUserMappingTable.userId, user.id),
        eq(dataSourceIntegrationUserMappingTable.dataSourceIntegrationId, dataSourceIntegrationId),
      ),
    )
    .returning();

  return deleted;
}
