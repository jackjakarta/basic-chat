import { type FolderRow } from '@/db/schema';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

export function useFoldersQuery(
  options?: Omit<UseQueryOptions<FolderRow[]>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<FolderRow[]>({
    queryKey: ['folders'],
    queryFn: fetchFolders,
    ...options,
  });
}

async function fetchFolders(): Promise<FolderRow[]> {
  const response = await fetch('/api/folders', { cache: 'no-store' });

  if (!response.ok) {
    throw new Error('Failed to fetch folders');
  }

  const { folders } = await response.json();

  return Array.isArray(folders) ? folders : [];
}
