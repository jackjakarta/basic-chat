'use server';

import { dbDeleteActiveIntegration } from '@/db/functions/data-source-integrations';
import { getUser } from '@/utils/auth';

export async function removeDataSourceIntegrationAction({
  dataSourceIntegrationId,
}: {
  dataSourceIntegrationId: string;
}) {
  const user = await getUser();

  try {
    const deleted = await dbDeleteActiveIntegration({
      userId: user.id,
      dataSourceIntegrationId,
    });

    if (deleted === undefined) {
      return {
        success: false,
        error: 'Data source integration not found or already deleted.',
      };
    }

    return {
      success: true,
      message: 'Data source integration deleted successfully.',
    };
  } catch (error) {
    console.error('Error deleting data source integration:', error);

    return {
      success: false,
      error: 'Data source integration not found or already deleted.',
    };
  }
}
