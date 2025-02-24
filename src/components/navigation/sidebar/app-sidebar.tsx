'use client';

import Spinner from '@/components/icons/spinner';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type ConversationRow } from '@/db/schema';
import { fetcher } from '@/utils/fetcher';
import { type ObscuredUser } from '@/utils/user';
import { User2 } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import useSWR from 'swr';

import { NavChats } from './nav-chats';
import { NavMain } from './nav-main';
import { NavSecondary } from './nav-secondary';
import { NavUser } from './nav-user';

type SidebarProps = React.ComponentProps<typeof Sidebar> & {
  // conversations: ConversationRow[];
  user: ObscuredUser;
};

export function AppSidebar({ user, ...props }: SidebarProps) {
  const { data, error, isLoading } = useSWR<{ conversations: ConversationRow[] }>(
    '/api/conversations',
    fetcher,
    { refreshInterval: 5000 },
  );

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <User2 className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        {isLoading && (
          <span className="py-2 px-4 animate-pulse self-center">
            <div className="flex flex-col items-center gap-4">
              <Spinner className="w-20 h-20" />
              Loading chats...
            </div>
          </span>
        )}
        {error && <span className="py-2 px-4">Failed to load conversations.</span>}
        {data && <NavChats conversations={data.conversations} />}
        <NavSecondary className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser {...user} />
      </SidebarFooter>
    </Sidebar>
  );
}
