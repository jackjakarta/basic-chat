import { openai } from '.';

export async function summarizeConversationTitle({
  userMessage,
  assistantMessage,
}: {
  userMessage: string;
  assistantMessage: string;
}) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4.1-nano',
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
