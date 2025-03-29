import { aiSearch } from '@/openai/search';

export async function openaiSearch({ searchQuery }: { searchQuery: string }) {
  try {
    const searchResults = await aiSearch({ searchQuery });
    return searchResults;
  } catch (error) {
    console.error({ error });
    return undefined;
  }
}
