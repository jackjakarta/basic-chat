import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from '@/components/ui/sidebar';
import { type ConversationRow } from '@/db/schema';
import React from 'react';

import ConversationItem from './conversation-item';

export function NavChats({ conversations }: { conversations: ConversationRow[] }) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {conversations.length > 0 ? (
          <Collapsible asChild open={true}>
            <SidebarMenuItem>
              <SidebarMenuButton className="hover:bg-transparent active:bg-transparent" asChild>
                <span>Chats</span>
              </SidebarMenuButton>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {conversations.map((conversation) => (
                    <ConversationItem key={conversation.id} conversation={conversation} />
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
