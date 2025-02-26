'use client';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { type ConversationRow } from '@/db/schema';
import { cw } from '@/utils/tailwind';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export function NavChats({ conversations }: { conversations: ConversationRow[] }) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {conversations.length > 0 ? (
          <Collapsible asChild defaultOpen={true}>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <span>Chats</span>
              </SidebarMenuButton>
              <CollapsibleTrigger asChild>
                <SidebarMenuAction className="data-[state=open]:rotate-90">
                  <ChevronRight />
                  <span className="sr-only">Toggle</span>
                </SidebarMenuAction>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {conversations.map((conversation) => (
                    <SidebarMenuSubItem key={conversation.id}>
                      <SidebarMenuSubButton
                        className={cw(pathname.includes(conversation.id) && 'bg-sidebar-accent')}
                        asChild
                      >
                        <Link
                          href={
                            conversation.agentId !== null
                              ? `/agents/${conversation.agentId}/c/${conversation.id}`
                              : `/c/${conversation.id}`
                          }
                        >
                          <span>{conversation.name}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ) : null}
      </SidebarMenu>
    </SidebarGroup>
  );
}
