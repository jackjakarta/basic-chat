'use client';

import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
} from '@/components/ui/sidebar';
import { type ConversationRow } from '@/db/schema';
import { fetcher } from '@/utils/fetcher';
import React from 'react';
import useSWR from 'swr';

import ConversationItem from './conversation-item';

type NavChatsProps = {
  onClickMobile?: () => void;
};

export function NavChats({ onClickMobile }: NavChatsProps) {
  const { data, isLoading } = useSWR<{ conversations: ConversationRow[] }>(
    '/api/conversations',
    fetcher,
  );

  return (
    <SidebarGroup>
      <SidebarMenu>
        <Collapsible asChild open={true}>
          <SidebarMenuItem>
            <SidebarMenuButton className="hover:bg-transparent active:bg-transparent" asChild>
              <span>Chats</span>
            </SidebarMenuButton>
            <CollapsibleContent>
              <SidebarMenuSub>
                {isLoading &&
                  Array.from({ length: 14 }).map((_, index) => <SidebarMenuSkeleton key={index} />)}

                {data &&
                  (data.conversations.length > 0 ? (
                    data.conversations.map((conversation) => (
                      <ConversationItem
                        key={conversation.id}
                        conversation={conversation}
                        onClickMobile={onClickMobile}
                      />
                    ))
                  ) : (
                    <span className="text-xs dark:opacity-70">No chats at the moment</span>
                  ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  );
}
