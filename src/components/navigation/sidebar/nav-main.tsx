'use client';

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Bot, Building, Plus } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

type NavMainProps = {
  onClickMobile?: () => void;
};

export function NavMain({ onClickMobile }: NavMainProps) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton onClick={onClickMobile} className="cursor-pointer" asChild>
            <Link href="/" className="flex items-center gap-2">
              <Plus />
              <span>New Chat</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton onClick={onClickMobile} className="cursor-pointer" asChild>
            <Link href="/agents" className="flex items-center gap-2">
              <Bot />
              <span>Agents</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton onClick={onClickMobile} className="cursor-pointer" asChild>
            <Link href="/" className="flex items-center gap-2">
              <Building />
              <span>Organisation</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
