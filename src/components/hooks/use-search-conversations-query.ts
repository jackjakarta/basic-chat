import { type ConversationRow } from '@/db/schema';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

type RecentOptions = Omit<UseQueryOptions<ConversationRow[]>, 'queryKey' | 'queryFn'>;

export function useRecentConversationsQuery({ enabled = true, ...options }: RecentOptions = {}) {
  return useQuery({
    queryKey: ['conversations', 'recent'],
    queryFn: () => fetchConversations(),
    enabled,
    staleTime: 60_000,
    ...options,
  });
}

type SearchOptions = Omit<UseQueryOptions<ConversationRow[]>, 'queryKey' | 'queryFn'> & {
  q: string;
};

export function useSearchConversationsQuery({ q, enabled = true, ...options }: SearchOptions) {
  return useQuery({
    queryKey: ['conversations', 'search', { q }],
    queryFn: () => fetchConversations({ q }),
    enabled: enabled && q.length > 0,
    staleTime: 30_000,
    placeholderData: (prev) => prev,
    ...options,
  });
}

async function fetchConversations({ q }: { q?: string } = {}): Promise<ConversationRow[]> {
  const params = new URLSearchParams();

  if (q !== undefined) {
    params.set('q', q);
  }

  const response = await fetch(`/api/conversations/search?${params.toString()}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch conversations: ${response.status} ${response.statusText}`);
  }

  const { conversations } = await response.json();

  return Array.isArray(conversations) ? conversations : [];
}
