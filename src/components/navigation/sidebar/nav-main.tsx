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
import { ChevronRight, Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function NavMain({ conversations }: { conversations: ConversationRow[] }) {
  const router = useRouter();

  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton className="cursor-pointer" onClick={() => router.push('/')} asChild>
            <div className="flex items-center gap-2">
              <Plus />
              <span>New Chat</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
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
                      <SidebarMenuSubButton asChild>
                        <Link href={`/c/${conversation.id}`}>
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
