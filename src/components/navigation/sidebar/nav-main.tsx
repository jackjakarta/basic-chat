'use client';

import SearchCommandMenu from '@/components/common/search-command';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { cw } from '@/utils/tailwind';
import { ArrowBigUp, Bot, Command, Plus, Search } from 'lucide-react';
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

  const [isOpen, setIsOpen] = React.useState(false);

  function handleSearchClick() {
    setIsOpen(true);

    if (onClickMobile !== undefined) {
      onClickMobile();
    }
  }

  return (
    <>
      <SearchCommandMenu isOpen={isOpen} setIsOpen={setIsOpen} />
      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={onClickMobile} className="cursor-pointer" asChild>
              <Link href="/" className="flex items-center gap-2">
                <Plus />
                <span>{t('new-chat')}</span>
                <div className="flex-grow" />
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Command className="h-[14px] w-[14px] mt-0.5" />
                  <ArrowBigUp className="h-[16px] w-[16px] mt-0.5" />
                  <span className="font-semibold">N</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSearchClick}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Search />
              <span>Search chats</span>
              <div className="flex-grow" />
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Command className="h-[14px] w-[14px] mt-0.5" />
                <span className="font-semibold">J</span>
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
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
}
