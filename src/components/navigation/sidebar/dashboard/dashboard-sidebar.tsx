'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import { type ObscuredUser } from '@/utils/user';
import React from 'react';

import { NavHeader } from '../nav-header';
import { NavSecondary } from '../nav-secondary';
import { NavUser } from '../nav-user';
import { NavSettings } from './nav-settings';

type SidebarProps = React.ComponentPropsWithoutRef<typeof Sidebar> & {
  user: ObscuredUser;
};

export default function DashboardSidebar({ user, ...props }: SidebarProps) {
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
        <NavSettings onClickMobile={handleItemClickMobile} />
        <div className="mt-auto">
          <NavSecondary />
        </div>
      </SidebarContent>
      <SidebarFooter>
        <NavUser {...user} />
      </SidebarFooter>
    </Sidebar>
  );
}
