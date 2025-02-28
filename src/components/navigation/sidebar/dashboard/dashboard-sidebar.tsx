'use client';

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';
import { type ObscuredUser } from '@/utils/user';
import React from 'react';

import { NavHeader } from '../nav-header';
import { NavMain } from '../nav-main';
import { NavSecondary } from '../nav-secondary';
import { NavUser } from '../nav-user';

type SidebarProps = React.ComponentProps<typeof Sidebar> & {
  user: ObscuredUser;
};

export default function DashboardSidebar({ user, ...props }: SidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavHeader {...user} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
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
