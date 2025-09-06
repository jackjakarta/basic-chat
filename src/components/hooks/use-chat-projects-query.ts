import { type ChatProjectRow } from '@/db/schema';
import { type WithConversations } from '@/db/types';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

type ChatProjectWithConversations = WithConversations<ChatProjectRow>;

export function useChatProjectsQuery(
  options?: Omit<UseQueryOptions<ChatProjectWithConversations[]>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<ChatProjectWithConversations[]>({
    queryKey: ['chat-projects'],
    queryFn: fetchChatProjects,
    ...options,
  });
}

async function fetchChatProjects(): Promise<ChatProjectWithConversations[]> {
  const response = await fetch('/api/chat-projects', { cache: 'no-store' });

  if (!response.ok) {
    throw new Error('Failed to fetch chat projects');
  }

  const { chatProjects } = await response.json();

  return Array.isArray(chatProjects) ? chatProjects : [];
}
