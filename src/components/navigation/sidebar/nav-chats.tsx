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

export function NavChats() {
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
                {isLoading
                  ? Array.from({ length: 14 }).map((_, index) => (
                      <SidebarMenuSkeleton key={index} />
                    ))
                  : data?.conversations.map((conversation) => (
                      <ConversationItem key={conversation.id} conversation={conversation} />
                    ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  );
}
