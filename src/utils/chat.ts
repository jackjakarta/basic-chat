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
    searchFiles: 'Searching my knowledge...',
    searchNotion: 'Searching Notion...',
    executeCode: 'Executing code...',
  };

  return mapping[inputString];
}

export function getUserMessage(messages: Message[]) {
  const userMessages = messages.filter((message) => message.role === 'user');

  if (userMessages.length === 0) {
    return '';
  }

  return userMessages[userMessages.length - 1]?.content;
}

export function getUserMessageAttachments(messages: Message[]) {
  const userMessages = messages.filter((message) => message.role === 'user');

  return userMessages[userMessages.length - 1]?.experimental_attachments;
}
