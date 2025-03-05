import { type ConversationRow } from '@/db/schema';

export async function fetchClientSideConversations(): Promise<ConversationRow[]> {
  const response = await fetch('/api/conversations', { cache: 'no-store' });

  if (!response.ok) {
    throw new Error('Failed to fetch conversations');
  }

  const data = await response.json();

  return Array.isArray(data.conversations) ? data.conversations : [];
}
