import { type AIModel } from '@/app/api/chat/types';
import { type ConversationMessageRow } from '@/db/schema';
import { type Message } from 'ai';

export function filterChatMessages({ chatMessages }: { chatMessages: ConversationMessageRow[] }) {
  const filteredMessages = Array.from(
    chatMessages
      .filter((message) => message.content !== '')
      .reduce((map, message) => {
        const existingMessage = map.get(message.orderNumber);

        if (!existingMessage || existingMessage.createdAt < message.createdAt) {
          map.set(message.orderNumber, message);
        }

        return map;
      }, new Map<number, (typeof chatMessages)[0]>())
      .values(),
  );

  return filteredMessages;
}

export function toolNameMap(inputString: string | undefined): string | undefined {
  if (inputString === undefined) {
    return undefined;
  }

  const mapping: Record<string, string> = {
    searchTheWeb: 'Searching the web...',
    generateImage: 'Generating image...',
    getBarcaMatches: 'Getting FC Barcelona matches...',
    searchFiles: 'Searching files...',
    searchNotion: 'Searching Notion...',
  };

  return mapping[inputString];
}

export function getModelName(model: AIModel) {
  const mapping: Record<AIModel, string> = {
    'gpt-4.1': 'GPT-4.1',
    'gpt-4.1-mini': 'GPT-4.1 Mini',
    'gpt-4o': 'GPT-4o',
    'gemini-2.5-pro-exp-03-25': 'Gemini 2.5 Pro',
    'gemini-2.0-flash': 'Gemini 2.0 Flash',
    'claude-3-7-sonnet-20250219': 'Claude 3.7 Sonnet',
    'pixtral-large-latest': 'Pixtral Large',
  };

  return mapping[model];
}

export function getUserMessage(messages: Message[]) {
  const userMessages = messages.filter((message) => message.role === 'user');

  if (userMessages.length === 0) {
    return '';
  }

  return userMessages[userMessages.length - 1]?.content;
}
