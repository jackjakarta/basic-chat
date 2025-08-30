import { dbSearchSimilarFiles } from '@/db/functions/vector-search';
import { tool } from 'ai';
import { z } from 'zod';

export function getDocumentFolderSearchTool({
  userId,
  folderId,
}: {
  userId: string;
  folderId: string;
}) {
  const documentFolderSearchTool = tool({
    description:
      "Search for documents in the user's folder if the user asks a question that the assistant cannot answer.",
    parameters: z.object({
      searchQuery: z.string().describe('The search query provided by the user.'),
    }),
    execute: async ({ searchQuery }) => {
      try {
        const toolResults = await documentFolderSearch({ searchQuery, userId, folderId });
        console.info({ toolResults });

        if (toolResults === undefined || toolResults.length === 0) {
          return `I could not find any relevant information about '${searchQuery}'.`;
        }

        return toolResults;
      } catch (error) {
        const errorMessage = `An error occurred while searching the documents. We are sorry.`;

        console.error({ error });
        throw new Error(errorMessage);
      }
    },
  });

  return documentFolderSearchTool;
}

async function documentFolderSearch({
  searchQuery,
  userId,
  folderId,
}: {
  searchQuery: string;
  userId: string;
  folderId: string;
}) {
  try {
    const searchResults = await dbSearchSimilarFiles({ searchQuery, userId, folderId });

    const formatedSearchResults = searchResults.map((doc) => ({
      id: doc.id,
      title: doc.name,
      content: doc.content ?? '',
    }));

    return formatedSearchResults;
  } catch (error) {
    console.error({ error });
    return undefined;
  }
}
