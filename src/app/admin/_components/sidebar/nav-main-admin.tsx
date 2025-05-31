'use client';

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { cw } from '@/utils/tailwind';
import { Bot, Plus, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

type NavMainProps = {
  onClickMobile?: () => void;
};

export function NavMainAdmin({ onClickMobile }: NavMainProps) {
  const t = useTranslations('sidebar');
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton onClick={onClickMobile} className="cursor-pointer" asChild>
            <Link href="/" className="flex items-center gap-2">
              <Plus />
              <span>{t('new-chat')}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            onClick={onClickMobile}
            className={cw(
              'cursor-pointer',
              pathname.startsWith('/admin/users') &&
                'bg-sidebar-accent text-sidebar-accent-foreground',
            )}
          >
            <Link href="/admin/users" className="flex items-center gap-2">
              <Users />
              <span>Users</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            onClick={onClickMobile}
            className={cw(
              'cursor-pointer',
              pathname === '/admin/models' && 'bg-sidebar-accent text-sidebar-accent-foreground',
            )}
          >
            <Link href="/admin/models" className="flex items-center gap-2">
              <Bot />
              <span>Models</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
