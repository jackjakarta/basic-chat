import { type ConversationRow } from './schema';

export type UpdateDbRow<T> = Partial<Omit<T, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>;
export type WithConversations<T> = T & { conversations: ConversationRow[] };
