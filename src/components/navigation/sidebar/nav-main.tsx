'use client';

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { cw } from '@/utils/tailwind';
import { Bot, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

type NavMainProps = {
  onClickMobile?: () => void;
};

export function NavMain({ onClickMobile }: NavMainProps) {
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
            onClick={onClickMobile}
            className={cw(
              'cursor-pointer',
              pathname.includes('/assistants') &&
                !pathname.includes('/c') &&
                'bg-sidebar-accent text-sidebar-accent-foreground',
            )}
            asChild
          >
            <Link href="/assistants" className="flex items-center gap-2">
              <Bot />
              <span>{t('agents')}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
