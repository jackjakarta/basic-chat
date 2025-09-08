import { ActiveIntegration } from '@/db/functions/data-source-integrations';
import { tool } from 'ai';
import { z } from 'zod';

import { NotionSearchClient } from '../../auth/notion/client';
import { type NotionIntegration } from '../types';

export async function getSearchNotionTool({
  notionDataSource,
}: {
  notionDataSource: NotionIntegration;
}) {
  const notionClient =
    notionDataSource !== undefined
      ? new NotionSearchClient(notionDataSource.oauthMetadata.access_token)
      : null;

  const finalTool = tool({
    description: 'If the user wants to search his Notion pages you should use this tool.',
    parameters: z.object({
      searchQuery: z.string().describe('The search query provided by the user.'),
    }),
    execute: async ({ searchQuery }) => {
      try {
        const toolResult =
          (await notionClient?.search(searchQuery, { filter: 'page', limit: 3 }).catch(() => [])) ??
          [];

        console.info({ toolResult });

        if (toolResult.length === 0) {
          return 'An error occurred while searching the data source. We are sorry.';
        }

        return toolResult;
      } catch (error) {
        console.error({ error });
        return error;
      }
    },
  });

  return finalTool;
}

export function getActiveNotionIntegration(
  integrations: ActiveIntegration[],
): NotionIntegration | undefined {
  const maybeIntegration = integrations.find((i) => i.oauthMetadata.type === 'notion');

  return maybeIntegration as NotionIntegration;
}
