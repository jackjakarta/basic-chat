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
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import ConversationItem from './conversation-item';
import { fetchClientSideConversations } from './utils';

type NavChatsProps = {
  onClickMobile?: () => void;
};

export function NavChats({ onClickMobile }: NavChatsProps) {
  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: fetchClientSideConversations,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

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

                {conversations &&
                  (conversations.length > 0 ? (
                    conversations.map((conversation) => (
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
