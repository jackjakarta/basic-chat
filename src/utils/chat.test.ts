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
        conversationId: '7cdcf9a0-5481-46f1-86f5-e2b362632856',
        role: 'user',
        orderNumber: 1,
        metadata: { modelId: 'gpt-4o' },
        updatedAt: new Date('2024-03-01T12:00:00Z'),
      },
      {
        id: '2',
        content: '',
        createdAt: new Date('2024-03-01T12:01:00Z'),
        userId: 'user1',
        conversationId: '7cdcf9a0-5481-46f1-86f5-e2b362632856',
        role: 'user',
        orderNumber: 2,
        metadata: { modelId: 'gpt-4o' },
        updatedAt: new Date('2024-03-01T12:00:00Z'),
      },
      {
        id: '3',
        content: 'Hi',
        createdAt: new Date('2024-03-01T12:02:00Z'),
        userId: 'user2',
        conversationId: '7cdcf9a0-5481-46f1-86f5-e2b362632856',
        role: 'assistant',
        orderNumber: 1,
        metadata: { modelId: 'gpt-4o' },
        updatedAt: new Date('2024-03-01T12:00:00Z'),
      },
      {
        id: '4',
        content: 'Welcome!',
        createdAt: new Date('2024-03-01T12:03:00Z'),
        userId: 'user2',
        conversationId: '7cdcf9a0-5481-46f1-86f5-e2b362632856',
        role: 'assistant',
        orderNumber: 3,
        metadata: { modelId: 'gpt-4o' },
        updatedAt: new Date('2024-03-01T12:00:00Z'),
      },
      {
        id: '5',
        content: 'Updated message',
        createdAt: new Date('2024-03-01T12:05:00Z'),
        userId: 'user1',
        conversationId: '7cdcf9a0-5481-46f1-86f5-e2b362632856',
        role: 'user',
        orderNumber: 1,
        metadata: { modelId: 'gpt-4o' },
        updatedAt: new Date('2024-03-01T12:00:00Z'),
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
        conversationId: '7cdcf9a0-5481-46f1-86f5-e2b362632856',
        role: 'user',
        orderNumber: 1,
        metadata: { modelId: 'gpt-4o' },
        updatedAt: new Date('2024-03-01T12:00:00Z'),
      },
      {
        id: '4',
        content: 'Welcome!',
        createdAt: new Date('2024-03-01T12:03:00Z'),
        userId: 'user2',
        conversationId: '7cdcf9a0-5481-46f1-86f5-e2b362632856',
        role: 'assistant',
        orderNumber: 3,
        metadata: { modelId: 'gpt-4o' },
        updatedAt: new Date('2024-03-01T12:00:00Z'),
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
        conversationId: '7cdcf9a0-5481-46f1-86f5-e2b362632856',
        role: 'user',
        metadata: { modelId: 'gpt-4o' },
        orderNumber: 1,
        updatedAt: new Date('2024-03-01T12:00:00Z'),
      },
      {
        id: '2',
        content: '',
        createdAt: new Date('2024-03-01T12:01:00Z'),
        userId: 'user1',
        conversationId: '7cdcf9a0-5481-46f1-86f5-e2b362632856',
        role: 'user',
        metadata: { modelId: 'gpt-4o' },
        orderNumber: 2,
        updatedAt: new Date('2024-03-01T12:00:00Z'),
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
        conversationId: '7cdcf9a0-5481-46f1-86f5-e2b362632856',
        role: 'user',
        orderNumber: 1,
        metadata: { modelId: 'gpt-4o' },
        updatedAt: new Date('2024-03-01T12:00:00Z'),
      },
      {
        id: '2',
        content: 'Hi there!',
        createdAt: new Date('2024-03-01T12:01:00Z'),
        userId: 'user2',
        conversationId: '7cdcf9a0-5481-46f1-86f5-e2b362632856',
        role: 'assistant',
        metadata: { modelId: 'gpt-4o' },
        orderNumber: 2,
        updatedAt: new Date('2024-03-01T12:00:00Z'),
      },
    ];

    const filteredMessages = filterChatMessages({ chatMessages });
    expect(filteredMessages).toHaveLength(2);
    expect(filteredMessages).toEqual(chatMessages);
  });
});
