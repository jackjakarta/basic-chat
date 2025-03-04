import { type ConversationMessageRow } from '@/db/schema';

import { filterChatMessages } from './chat';

describe('filterChatMessages', () => {
  it('should filter out empty messages and keep the latest message per orderNumber', () => {
    const chatMessages: ConversationMessageRow[] = [
      {
        id: '1',
        content: 'Hello',
        createdAt: new Date('2024-03-01T12:00:00Z'),
        userId: 'user1',
        conversationId: 'conv1',
        role: 'user',
        orderNumber: 1,
      },
      {
        id: '2',
        content: '',
        createdAt: new Date('2024-03-01T12:01:00Z'),
        userId: 'user1',
        conversationId: 'conv1',
        role: 'user',
        orderNumber: 2,
      },
      {
        id: '3',
        content: 'Hi',
        createdAt: new Date('2024-03-01T12:02:00Z'),
        userId: 'user2',
        conversationId: 'conv1',
        role: 'assistant',
        orderNumber: 1,
      },
      {
        id: '4',
        content: 'Welcome!',
        createdAt: new Date('2024-03-01T12:03:00Z'),
        userId: 'user2',
        conversationId: 'conv1',
        role: 'assistant',
        orderNumber: 3,
      },
      {
        id: '5',
        content: 'Updated message',
        createdAt: new Date('2024-03-01T12:05:00Z'),
        userId: 'user1',
        conversationId: 'conv1',
        role: 'user',
        orderNumber: 1,
      },
    ];

    const filteredMessages = filterChatMessages({ chatMessages });

    expect(filteredMessages).toHaveLength(2);
    expect(filteredMessages).toEqual([
      {
        id: '5',
        content: 'Updated message',
        createdAt: new Date('2024-03-01T12:05:00Z'),
        userId: 'user1',
        conversationId: 'conv1',
        role: 'user',
        orderNumber: 1,
      },
      {
        id: '4',
        content: 'Welcome!',
        createdAt: new Date('2024-03-01T12:03:00Z'),
        userId: 'user2',
        conversationId: 'conv1',
        role: 'assistant',
        orderNumber: 3,
      },
    ]);
  });

  it('should return an empty array if all messages are empty', () => {
    const chatMessages: ConversationMessageRow[] = [
      {
        id: '1',
        content: '',
        createdAt: new Date('2024-03-01T12:00:00Z'),
        userId: 'user1',
        conversationId: 'conv1',
        role: 'user',
        orderNumber: 1,
      },
      {
        id: '2',
        content: '',
        createdAt: new Date('2024-03-01T12:01:00Z'),
        userId: 'user1',
        conversationId: 'conv1',
        role: 'user',
        orderNumber: 2,
      },
    ];

    const filteredMessages = filterChatMessages({ chatMessages });
    expect(filteredMessages).toHaveLength(0);
  });

  it('should return the same messages if they are unique by orderNumber and not empty', () => {
    const chatMessages: ConversationMessageRow[] = [
      {
        id: '1',
        content: 'Hello',
        createdAt: new Date('2024-03-01T12:00:00Z'),
        userId: 'user1',
        conversationId: 'conv1',
        role: 'user',
        orderNumber: 1,
      },
      {
        id: '2',
        content: 'Hi there!',
        createdAt: new Date('2024-03-01T12:01:00Z'),
        userId: 'user2',
        conversationId: 'conv1',
        role: 'assistant',
        orderNumber: 2,
      },
    ];

    const filteredMessages = filterChatMessages({ chatMessages });
    expect(filteredMessages).toHaveLength(2);
    expect(filteredMessages).toEqual(chatMessages);
  });
});
