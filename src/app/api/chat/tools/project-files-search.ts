import { dbSearchChatProjectFiles } from '@/db/functions/vector-search';
import { tool } from 'ai';
import { z } from 'zod';

export function getProjectFilesSearchTool({
  userId,
  chatProjectId,
}: {
  userId: string;
  chatProjectId: string;
}) {
  const webSearchTool = tool({
    description:
      'Use this tool if the user is in a chat project and asks a question related to the files they have uploaded. The user will provide the chatProjectId and their userId along with the search query. If the user does not provide these, do not use this tool. Instead, use the web search tool. Always return your answer in the context of the files uploaded by the user. If you cannot find any relevant information in the files, respond with "I could not find any relevant information about [searchQuery] in your files." Do not make up answers. Never return information that is not found in the files. Never return URLs or references to web pages. Always format your answer in markdown. If the user asks a question that is not related to their files, do not use this tool. Instead, use the web search tool.',
    parameters: z.object({
      searchQuery: z.string().describe('The search query provided by the user.'),
    }),
    execute: async ({ searchQuery }) => {
      try {
        const toolResults = await filesSearch({ searchQuery, userId, chatProjectId });
        console.debug({ toolResults });

        if (!toolResults) {
          return `I could not find any relevant information about '${searchQuery}'.`;
        }

        return toolResults;
      } catch (error) {
        const errorMessage = `An error occurred while searching the web. We are sorry.`;

        if (error instanceof Error) {
          console.error({ error: error.message });
          throw new Error(errorMessage);
        }

        console.error({ error });
        throw new Error(errorMessage);
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
}) {
  try {
    const searchResults = await dbSearchChatProjectFiles({ searchQuery, userId, chatProjectId });

    const formatedResults = searchResults.map((r) => {
      return {
        fileName: r.fileName,
        content: r.content,
      };
    });

    return formatedResults;
  } catch (error) {
    console.error({ error });
    return undefined;
  }
}
