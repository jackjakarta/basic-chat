import { type DataSourceIntegrationInsertModel } from '@/db/schema';

export const dataSourceIntegrations: DataSourceIntegrationInsertModel[] = [
  {
    id: '34d487a4-b19b-4a03-9137-b6dd56f906fc',
    name: 'Notion',
    description:
      'With the Notion integration, the chat can search your knowledge and project database directly in the chat.',
    type: 'notion',
    state: 'active',
  },
];
