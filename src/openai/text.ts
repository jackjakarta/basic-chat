import { openai } from '.';

export async function summarizeConversationTitle({
  userMessage,
  assistantMessage,
}: {
  userMessage: string;
  assistantMessage: string;
}) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You summarize the first messages of conversations in 3-5 word titles. Be creative! Please do not use Markdown or emojis.',
      },
      {
        role: 'user',
        content: `Summarize this content into a title: User: ${userMessage} Assistant: ${assistantMessage}`,
      },
    ],
  });

  const summary = response.choices[0]?.message.content;

  if (!summary) {
    return 'New Chat';
  }

  return summary;
}

export async function aiSearch({ searchQuery }: { searchQuery: string }) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-search-preview',
    web_search_options: {
      search_context_size: 'medium',
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
