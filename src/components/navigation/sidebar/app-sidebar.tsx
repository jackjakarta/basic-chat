'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import { SubscriptionState } from '@/stripe/subscription';
import { type ObscuredUser } from '@/utils/user';
import React from 'react';

import { NavChats } from './nav-chats';
import { NavHeader } from './nav-header';
import { NavMain } from './nav-main';
import { NavSecondary } from './nav-secondary';
import { NavUser } from './nav-user';

type SidebarProps = React.ComponentProps<typeof Sidebar> & {
  user: ObscuredUser & { subscription: SubscriptionState };
  avatarUrl?: string;
};

export default function AppSidebar({ user, avatarUrl, ...props }: SidebarProps) {
  const { setOpenMobile } = useSidebar();

  function handleItemClickMobile() {
    setOpenMobile(false);
  }

  return (
    <Sidebar variant="inset" className="border-accent" {...props}>
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavMain onClickMobile={handleItemClickMobile} />
        <NavChats onClickMobile={handleItemClickMobile} />
        <NavSecondary className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser {...user} avatarUrl={avatarUrl} />
      </SidebarFooter>
    </Sidebar>
  );
}
