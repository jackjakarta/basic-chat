import { openai } from '.';

export async function summarizeConversationTitle({ content }: { content: string }) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You summarize the first messages of conversations in 3-5 word titles. Be creative! Please do not use Markdown or emojis.',
      },
      { role: 'user', content: `Summarize this content into a title: ${content}` },
    ],
  });

  const summary = response.choices[0]?.message.content;

  return summary;
}
