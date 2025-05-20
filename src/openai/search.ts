import { openai } from '.';

export async function aiSearch({ searchQuery }: { searchQuery: string }) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-search-preview',
    web_search_options: {
      search_context_size: 'high',
    },
    messages: [
      {
        role: 'user',
        content: searchQuery,
      },
    ],
  });

  const searchResults = {
    textContent: completion.choices[0]?.message.content,
    sources: completion.choices[0]?.message.annotations?.map((annotation) => ({
      title: annotation.url_citation.title,
      url: annotation.url_citation.url,
    })),
  };

  return searchResults;
}
