import { env } from '@/env';
import { tool } from 'ai';
import { z } from 'zod';

const apiKey = env.openaiApiKey;

export function fileSearchTool({ vectorStoreId }: { vectorStoreId: string }) {
  const fileSearchTool = tool({
    description:
      'Search own knowledge base of files if the user asks a question that the assistant cannot answer. Or if the user asks the assistant to search the knowledge.',
    parameters: z.object({
      searchQuery: z.string().describe('The search query provided by the user.'),
    }),
    execute: async ({ searchQuery }) => {
      try {
        const toolResults = await searchVectorStore({ searchQuery, vectorStoreId });
        console.debug({ toolResults });

        if (!toolResults) {
          return `I could not find any relevant information about '${searchQuery}'.`;
        }

        return toolResults;
      } catch (error) {
        const errorMessage = `An error occurred while searching the the files. We are sorry.`;

        if (error instanceof Error) {
          console.error({ error: error.message });
          throw new Error(errorMessage);
        }

        console.error({ error });
        throw new Error(errorMessage);
      }
    },
  });

  return fileSearchTool;
}

async function searchVectorStore({
  searchQuery,
  vectorStoreId,
}: {
  searchQuery: string;
  vectorStoreId: string;
}) {
  const response = await fetch(`https://api.openai.com/v1/vector_stores/${vectorStoreId}/search`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: searchQuery,
      // filters,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Request failed with status ${response.status}: ${errorBody}`);
  }

  const data = await response.json();
  const formatedData = JSON.stringify(data, null, 2);

  return formatedData;
}
