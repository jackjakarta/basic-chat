'use client';

import LoadingText from '@/components/common/loading-text';
import BouncingBallsLoading from '@/components/icons/animated/bouncing-balls';
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
  user: ObscuredUser;
};

export default function AppSidebar({ user, ...props }: SidebarProps) {
  const { data, error, isLoading } = useSWR<{ conversations: ConversationRow[] }>(
    '/api/conversations',
    fetcher,
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
          <div className="flex flex-col items-center gap-2 py-2 px-4 self-center">
            <BouncingBallsLoading className="text-primary w-12 h-12 animate-pulse" />
            <LoadingText className="text-primary text-sm ">Loading chats...</LoadingText>
          </div>
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
