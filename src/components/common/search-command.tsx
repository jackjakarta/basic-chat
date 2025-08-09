'use client';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

import { useConversationsQuery } from '../hooks/use-conversations-query';
import { useKeyboardShortcut } from '../hooks/use-keyboard-shortcut';
import { Skeleton } from '../ui/skeleton';

type SearchCommandMenuProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
};

export default function SearchCommandMenu({
  isOpen: open,
  setIsOpen: setOpen,
}: SearchCommandMenuProps) {
  const router = useRouter();

  const {
    data: conversations = [],
    isLoading,
    isError,
  } = useConversationsQuery({
    enabled: open,
  });

  function handleSelect(conversationId: string, assistantId: string | null) {
    const path =
      assistantId !== null
        ? `/assistants/${assistantId}/c/${conversationId}`
        : `/c/${conversationId}`;

    router.push(path);
    setOpen(false);
  }

  useKeyboardShortcut({
    key: 'k',
    callback: () => setOpen((prev) => !prev),
  });

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search chats…" />
      <CommandList className="cmd-scroll-area">
        <CommandEmpty>No chats found.</CommandEmpty>
        <CommandGroup>
          {isLoading && (
            <>
              {Array.from({ length: 5 }).map((_, index) => (
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

          {!isLoading &&
            !isError &&
            conversations.length > 0 &&
            conversations.map((conversation) => (
              <CommandItem
                key={conversation.id}
                value={`${conversation.name}|${conversation.id}`}
                onSelect={() => handleSelect(conversation.id, conversation.assistantId)}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                <span>{conversation.name ?? 'New Chat'}</span>
              </CommandItem>
            ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
