import { aiSearch } from '@/openai/search';
import { tool } from 'ai';
import { z } from 'zod';

export function getWebSearchTool() {
  const webSearchTool = tool({
    description:
      'Search the web if the user asks a question that the assistant cannot answer. Or if the user asks the assistant to search the web.',
    parameters: z.object({
      searchQuery: z.string().describe('The search query provided by the user.'),
    }),
    execute: async ({ searchQuery }) => {
      try {
        const toolResults = await openaiSearch({ searchQuery });
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

async function openaiSearch({ searchQuery }: { searchQuery: string }) {
  try {
    const searchResults = await aiSearch({ searchQuery });
    return searchResults;
  } catch (error) {
    console.error({ error });
    return undefined;
  }
}
