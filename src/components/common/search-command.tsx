'use client';

import { useDebounce } from '@/components/hooks/use-debounce';
import { useSpinDelay } from '@/components/hooks/use-spin-delay';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '@/components/ui/command';
import { formatDateToDayMonthYear } from '@/utils/date';
import { cw } from '@/utils/tailwind';
import { Bot, MessageCircle, Plus, Settings, Unplug } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

import { useKeyboardShortcut } from '../hooks/use-keyboard-shortcut';
import {
  useRecentConversationsQuery,
  useSearchConversationsQuery,
} from '../hooks/use-search-conversations-query';
import { Skeleton } from '../ui/skeleton';

type SearchCommandMenuProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  withNavigation?: boolean;
  keyShortcutEnabled?: boolean;
};

export default function SearchCommandMenu({
  isOpen,
  setIsOpen,
  withNavigation = true,
  keyShortcutEnabled = true,
}: SearchCommandMenuProps) {
  const router = useRouter();

  const [search, setSearch] = React.useState('');
  const debounced = useDebounce(search, 350);

  const {
    data: recent = [],
    isLoading: loadingRecent,
    isError: errorRecent,
  } = useRecentConversationsQuery({ enabled: isOpen && debounced.length === 0 });

  const {
    data: results = [],
    isFetching: searching,
    isError: errorSearch,
  } = useSearchConversationsQuery({ q: debounced, enabled: isOpen && debounced.length > 0 });

  const conversations = debounced.length > 0 ? results : recent;
  const isLoading = debounced.length > 0 ? searching : loadingRecent;
  const isError = debounced.length > 0 ? errorSearch : errorRecent;
  const showInitialLoad = useSpinDelay(isLoading, { delay: 150, minDuration: 300 });

  useKeyboardShortcut({
    key: 'k',
    callbackFn: () => setIsOpen((prev) => !prev),
    enabled: keyShortcutEnabled,
  });

  async function handleSelect(conversationId: string, assistantId: string | null) {
    const path =
      assistantId !== null
        ? `/assistants/${assistantId}/c/${conversationId}`
        : `/c/${conversationId}`;

    router.push(path);
    setIsOpen(false);
  }

  function handleNavigation(path: string) {
    setIsOpen(false);
    router.push(path);
  }

  return (
    <CommandDialog
      open={isOpen}
      onOpenChange={setIsOpen}
      contentClassName="min-h-[470px] rounded-xl sm:min-w-[550px]"
    >
      <CommandInput
        placeholder="Dialog suchen oder navigieren"
        value={search}
        onValueChange={setSearch}
      />
      <CommandList className="max-h-[420px]">
        <CommandEmpty>No chats found.</CommandEmpty>
        {withNavigation && (
          <CommandGroup heading="Navigation">
            <CommandItem
              value="New chat"
              className="flex cursor-pointer items-center gap-3 rounded-xl"
              onSelect={() => handleNavigation('/')}
            >
              <Plus className="size-5" />
              <span>New chat</span>
              <CommandShortcut className="text-sm text-muted-foreground/60">⇧⌘O</CommandShortcut>
            </CommandItem>

            <CommandItem
              value="Assistants"
              className="flex cursor-pointer items-center gap-3 rounded-xl"
              onSelect={() => handleNavigation('/assistants')}
            >
              <Bot className="size-5" />
              <span>Assistants</span>
            </CommandItem>

            <CommandItem
              value="Integrations"
              className="flex cursor-pointer items-center gap-3 rounded-xl"
              onSelect={() => handleNavigation('/settings/integrations')}
            >
              <Unplug className="size-5" />
              <span>Integrations</span>
            </CommandItem>
            <CommandItem
              value="Settings"
              className="flex cursor-pointer items-center gap-3 rounded-xl"
              onSelect={() => handleNavigation('/settings/profile')}
            >
              <Settings className="size-5" />
              <span>Settings</span>
            </CommandItem>
          </CommandGroup>
        )}
        <CommandGroup heading="Chats">
          {showInitialLoad && (
            <>
              {Array.from({ length: 8 }).map((_, index) => (
                <CommandItem key={index} className="cursor-default">
                  <Skeleton className="h-4 w-full" />
                </CommandItem>
              ))}
            </>
          )}

          {isError && (
            <CommandItem className="pointer-events-none mt-2 flex cursor-default items-center justify-center">
              <span className="text-xs text-destructive">Error loading chats</span>
            </CommandItem>
          )}

          {!isError &&
            conversations.map((conversation) => (
              <CommandItem
                key={conversation.id}
                value={`${conversation.name}|${conversation.id}`}
                onSelect={() => handleSelect(conversation.id, conversation.assistantId)}
                className={cw(
                  'my-0 flex cursor-pointer items-center justify-between rounded-xl transition-opacity duration-200',
                  isLoading ? 'opacity-60' : 'opacity-100',
                )}
              >
                <div className="flex min-w-0 max-w-[calc(100%-130px)] flex-1 items-center gap-1">
                  <MessageCircle className="mr-2 size-5" />
                  <span className="truncate">{conversation.name ?? 'New Chat'}</span>
                </div>

                <span className="text-xs text-muted-foreground/60">
                  {formatDateToDayMonthYear(conversation.updatedAt)}
                </span>
              </CommandItem>
            ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
