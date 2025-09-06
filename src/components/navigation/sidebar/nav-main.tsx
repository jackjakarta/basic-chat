'use client';

import { useCommandMenu } from '@/components/providers/command-menu';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { cw } from '@/utils/tailwind';
import { ArrowBigUp, Bot, Command, Folder, Images, Plus, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

type NavMainProps = {
  onClickMobile?: () => void;
};

export function NavMain({ onClickMobile }: NavMainProps) {
  const pathname = usePathname();
  const t = useTranslations('sidebar');
  const { setIsOpen } = useCommandMenu();

  function handleSearchClick() {
    setIsOpen(true);

    if (onClickMobile !== undefined) {
      onClickMobile();
    }
  }

  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton onClick={onClickMobile} className="group/item cursor-pointer" asChild>
            <Link href="/" className="flex items-center gap-2">
              <Plus />
              <span>{t('new-chat')}</span>
              <div className="flex-grow" />
              <div className="invisible flex items-center gap-1.5 text-sm text-muted-foreground group-hover/item:visible">
                <Command className="size-[14px]" />
                <ArrowBigUp className="size-[16px]" />
                <span className="font-semibold">O</span>
              </div>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={handleSearchClick}
            className="group/item flex cursor-pointer items-center gap-2"
          >
            <Search />
            <span>{t('search-chats')}</span>
            <div className="flex-grow" />
            <div className="invisible flex items-center gap-1.5 text-sm text-muted-foreground group-hover/item:visible">
              <Command className="h-[14px] w-[14px]" />
              <span className="font-semibold">K</span>
            </div>
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
              <span>{t('assistants')}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={onClickMobile}
            className={cw(
              'cursor-pointer',
              pathname.startsWith('/gallery') && 'bg-sidebar-accent text-sidebar-accent-foreground',
            )}
            asChild
          >
            <Link href="/gallery" className="flex items-center gap-2">
              <Images />
              <span>Gallery</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={onClickMobile}
            className={cw(
              'cursor-pointer',
              pathname.startsWith('/p') && 'bg-sidebar-accent text-sidebar-accent-foreground',
            )}
            asChild
          >
            <Link href="/p" className="flex items-center gap-2">
              <Folder />
              <span>Projects</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
