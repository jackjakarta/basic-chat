'use client';

import { useChatProjectsQuery } from '@/components/hooks/use-chat-projects-query';
import { useConversationsQuery } from '@/components/hooks/use-conversations-query';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
} from '@/components/ui/sidebar';
import { useTranslations } from 'next-intl';
import React from 'react';

import ConversationItem from './conversation-item';

type NavChatsProps = {
  onClickMobile?: () => void;
};

export function NavChats({ onClickMobile }: NavChatsProps) {
  const t = useTranslations('sidebar');

  const {
    data: conversations = [],
    isLoading: isConversationsLoading,
    isError: isConversationsError,
  } = useConversationsQuery({
    refetchOnWindowFocus: false,
  });

  const {
    data: chatProjects = [],
    isLoading: isProjectsLoading,
    isError: isProjectsError,
  } = useChatProjectsQuery({
    refetchOnWindowFocus: false,
  });

  const filteredConversations = conversations.filter((conv) => conv.chatProjectId === null);

  const isError = isConversationsError || isProjectsError;
  const isLoading = isConversationsLoading || isProjectsLoading;
  const itemsLoaded = !isLoading && !isError;

  return (
    <>
      <SidebarGroup>
        <SidebarMenu>
          <Collapsible asChild open={true}>
            <SidebarMenuItem>
              <SidebarMenuButton className="hover:bg-transparent active:bg-transparent" asChild>
                <span>{t('chats')}</span>
              </SidebarMenuButton>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {isLoading &&
                    Array.from({ length: 14 }).map((_, index) => (
                      <SidebarMenuSkeleton key={index} />
                    ))}

                  {isError && (
                    <span className="text-xs dark:opacity-70">{t('error-loading-chats')}</span>
                  )}

                  {itemsLoaded &&
                    (filteredConversations.length > 0 ? (
                      filteredConversations.map((conversation) => (
                        <ConversationItem
                          key={conversation.id}
                          conversation={conversation}
                          onClickMobile={onClickMobile}
                          chatProjects={chatProjects.length > 0 ? chatProjects : []}
                        />
                      ))
                    ) : (
                      <span className="text-xs dark:opacity-70">{t('no-chats')}</span>
                    ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
}
