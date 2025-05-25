'use client';

import { NavHeader } from '@/components/navigation/sidebar/nav-header';
import { NavSecondary } from '@/components/navigation/sidebar/nav-secondary';
import { NavUser } from '@/components/navigation/sidebar/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import { type ObscuredUser } from '@/utils/user';
import React from 'react';

import { NavMainAdmin } from './nav-main-admin';

type SidebarProps = React.ComponentProps<typeof Sidebar> & {
  user: ObscuredUser;
  avatarUrl?: string;
};

export default function AdminSidebar({ user, avatarUrl, ...props }: SidebarProps) {
  const { setOpenMobile } = useSidebar();

  function handleItemClickMobile() {
    setOpenMobile(false);
  }

  return (
    <Sidebar variant="sidebar" className="border-accent" {...props}>
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavMainAdmin onClickMobile={handleItemClickMobile} />
        <NavSecondary className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser {...user} avatarUrl={avatarUrl} />
      </SidebarFooter>
    </Sidebar>
  );
}
