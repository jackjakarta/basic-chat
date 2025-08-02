import { type ConversationRow } from '@/db/schema';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

export function useConversationsQuery(
  options?: Omit<UseQueryOptions<ConversationRow[]>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<ConversationRow[]>({
    queryKey: ['conversations'],
    queryFn: fetchConversations,
    ...options,
  });
}

async function fetchConversations(): Promise<ConversationRow[]> {
  const response = await fetch('/api/conversations', { cache: 'no-store' });

  if (!response.ok) {
    throw new Error('Failed to fetch conversations');
  }

  const data = await response.json();

  return Array.isArray(data.conversations) ? data.conversations : [];
}
