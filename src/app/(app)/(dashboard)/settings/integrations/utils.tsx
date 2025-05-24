import { type DataSourceIntegrationModel } from '@/db/schema';

import { NotionIcon } from './icons';

export function getLoginByDataSourceIntegration(dataSourceIntegration: DataSourceIntegrationModel) {
  if (dataSourceIntegration.type === 'notion') {
    return { redirectUri: '/api/auth/notion/login' };
  }

  return undefined;
}

export function IntegrationIcon({ type }: { type: DataSourceIntegrationModel['type'] }) {
  switch (type) {
    case 'notion':
      return <NotionIcon />;

    default:
      return null;
  }
}
