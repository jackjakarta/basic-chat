'use client';

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Bot, Building, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React from 'react';

type NavMainProps = {
  onClickMobile?: () => void;
};

export function NavMain({ onClickMobile }: NavMainProps) {
  const t = useTranslations('sidebar');

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
          <SidebarMenuButton onClick={onClickMobile} className="cursor-pointer" asChild>
            <Link href="/agents" className="flex items-center gap-2">
              <Bot />
              <span>{t('agents')}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton onClick={onClickMobile} className="cursor-pointer" asChild>
            <Link href="/" className="flex items-center gap-2">
              <Building />
              <span>{t('organisation')}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
