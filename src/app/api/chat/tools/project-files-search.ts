import { dbSearchChatProjectFiles } from '@/db/functions/vector-search';
import { getEmbedding } from '@/openai/embed';
import { tool } from 'ai';
import { z } from 'zod';

import { getToolResultSchema, type ToolError } from './types';

const searchResultSchema = z.object({
  fileName: z.string().describe('The name of the file where the content was found.'),
  content: z.string().describe('The content from the file that is relevant to the search query.'),
  url: z.string().url().describe('A URL to access the file.'),
});
export const projectSearchToolResultSchema = getToolResultSchema(searchResultSchema);

export type ProjectSearchResult = z.infer<typeof searchResultSchema>;
export type ProjectSearchToolResult = z.infer<typeof projectSearchToolResultSchema>;
export type ProjectSearchToolResponse = ProjectSearchToolResult | ToolError;

export function getProjectFilesSearchTool({
  userId,
  chatProjectId,
}: {
  userId: string;
  chatProjectId: string;
}) {
  const webSearchTool = tool({
    description:
      'Use this tool if the user is in a chat project and asks a question related to the files they have uploaded.',
    parameters: z.object({
      searchQuery: z.string().describe('The search query provided by the user.'),
    }),
    execute: async ({ searchQuery }): Promise<ProjectSearchToolResponse> => {
      try {
        const toolResults = await filesSearch({ searchQuery, userId, chatProjectId });

        if (toolResults.length === 0) {
          return {
            success: false,
            error: `I could not find any relevant information about '${searchQuery}'.`,
          };
        }

        return {
          success: true,
          result: toolResults,
        };
      } catch (error) {
        console.error({ error });
        return {
          success: false,
          error: 'An error occurred while searching the files. We are sorry.',
        };
      }
    },
  });

  return webSearchTool;
}

async function filesSearch({
  searchQuery,
  userId,
  chatProjectId,
}: {
  searchQuery: string;
  userId: string;
  chatProjectId: string;
}): Promise<ProjectSearchResult[]> {
  const queryEmbedding = await getEmbedding({ input: searchQuery });

  if (queryEmbedding === undefined) {
    throw new Error('Failed to get embedding for search query');
  }

  const searchResults = await dbSearchChatProjectFiles({ queryEmbedding, userId, chatProjectId });

  const formatedResults = searchResults.map((r) => {
    return {
      fileName: r.fileName,
      content: r.content,
      url: r.url,
    };
  });

  return formatedResults;
}
