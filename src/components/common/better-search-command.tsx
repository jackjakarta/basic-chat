'use client';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { type ConversationRow } from '@/db/schema';
import { useVirtualizer } from '@tanstack/react-virtual';
import Fuse from 'fuse.js';
import { MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

import { useConversationsQuery } from '../hooks/use-conversations-query';
import { Skeleton } from '../ui/skeleton';

type SearchCommandMenuProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
};

type LiteConversation = Pick<ConversationRow, 'id' | 'assistantId' | 'name' | 'updatedAt'>;

export default function SearchCommandMenu({
  isOpen: open,
  setIsOpen: setOpen,
}: SearchCommandMenuProps) {
  const router = useRouter();

  // Only mount the dialog when open (avoids building indexes / virtualizer while closed)
  if (!open) {
    // Still keep the global hotkey below (effect is outside this return)
  }

  const selectLite = React.useCallback(
    (rows: ConversationRow[]) =>
      rows.map(({ id, assistantId, name, updatedAt, createdAt, userId }) => ({
        id,
        assistantId,
        name: name ?? 'New Chat',
        updatedAt,
        createdAt,
        userId,
      })),
    [],
  );

  const {
    data: conversations = [],
    isLoading,
    isError,
  } = useConversationsQuery({
    enabled: open, // fetch only when the dialog is open
    staleTime: 60_000, // keep hot for a minute
    gcTime: 5 * 60_000, // free memory after 5 minutes idle
    select: selectLite, // slim down the shape early
  });

  function handleSelect(conversationId: string, assistantId: string | null) {
    const path =
      assistantId !== null
        ? `/assistants/${assistantId}/c/${conversationId}`
        : `/c/${conversationId}`;

    router.push(path);
    setOpen(false);
  }

  // --- search input (debounced via useDeferredValue) ---
  const [q, setQ] = React.useState('');
  const deferredQ = React.useDeferredValue(q);

  // --- build Fuse index only when data changes (not on each keystroke) ---
  const fuse = React.useMemo(() => {
    return new Fuse(conversations, {
      keys: ['name'],
      threshold: 0.35, // typo‑tolerant but not too fuzzy
      ignoreLocation: true,
      includeScore: true,
      minMatchCharLength: 2,
    });
  }, [conversations]);

  const filtered: LiteConversation[] = React.useMemo(() => {
    if (!deferredQ.trim()) {
      // Optional: sort recents first if you have updatedAt
      return [...conversations].sort((a, b) => {
        const aT = a.updatedAt ? +new Date(a.updatedAt) : 0;
        const bT = b.updatedAt ? +new Date(b.updatedAt) : 0;
        return bT - aT;
      });
    }
    return fuse.search(deferredQ).map((r) => r.item);
  }, [conversations, deferredQ, fuse]);

  // --- virtualization setup ---
  const parentRef = React.useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 36, // px; tweak to your row height
    overscan: 6,
  });

  // Global hotkey: ⌘/Ctrl + K
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [setOpen]);

  // Render nothing until open, so we don't mount heavy UI in the background.
  if (!open) return null;

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search chats…" onValueChange={setQ} value={q} />
      <CommandList ref={parentRef} className="cmd-scroll-area">
        <CommandEmpty>
          {isLoading ? 'Loading…' : deferredQ ? 'No chats match that.' : 'No chats found.'}
        </CommandEmpty>

        <CommandGroup>
          {isLoading && (
            <>
              {Array.from({ length: 8 }).map((_, index) => (
                <CommandItem key={index} className="cursor-default">
                  <Skeleton className="h-4 w-full" />
                </CommandItem>
              ))}
            </>
          )}

          {isError && (
            <CommandItem className="cursor-default">
              <span className="text-xs text-red-500">Error loading chats</span>
            </CommandItem>
          )}

          {!isLoading && !isError && filtered.length > 0 && (
            <div
              style={{
                height: rowVirtualizer.getTotalSize(),
                position: 'relative',
              }}
            >
              {rowVirtualizer.getVirtualItems().map((v) => {
                const c = filtered[v.index];
                return (
                  <div
                    key={c?.id}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      transform: `translateY(${v.start}px)`,
                      height: v.size,
                    }}
                  >
                    <CommandItem
                      value={c?.name ?? 'New Chat'}
                      onSelect={() => handleSelect(c?.id ?? '', c?.assistantId ?? null)}
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      <span className="truncate">{c?.name ?? 'New Chat'}</span>
                    </CommandItem>
                  </div>
                );
              })}
            </div>
          )}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
