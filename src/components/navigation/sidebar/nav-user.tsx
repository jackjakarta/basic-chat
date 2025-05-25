'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { type ObscuredUser } from '@/utils/user';
import { ChevronsUpDown, LogOut, Settings2, ShieldUser, Unplug, User2 } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export function NavUser({
  firstName,
  lastName,
  email,
  avatarUrl,
  isSuperAdmin,
}: ObscuredUser & { avatarUrl?: string }) {
  const { isMobile } = useSidebar();
  const t = useTranslations('sidebar.user-menu');
  const tAuth = useTranslations('auth');

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={avatarUrl} alt="avatar" />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {firstName} {lastName}
                </span>
                <span className="truncate text-xs">{email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={avatarUrl} alt="avatar" />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {firstName} {lastName}
                  </span>
                  <span className="truncate text-xs">{email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {isSuperAdmin && (
                <Link href="/admin">
                  <DropdownMenuItem className="cursor-pointer">
                    <ShieldUser />
                    Admin
                  </DropdownMenuItem>
                </Link>
              )}
              <Link href="/settings/profile">
                <DropdownMenuItem className="cursor-pointer">
                  <User2 />
                  {t('profile')}
                </DropdownMenuItem>
              </Link>
              <Link href="/settings/integrations">
                <DropdownMenuItem className="cursor-pointer">
                  <Unplug />
                  {t('integrations')}
                </DropdownMenuItem>
              </Link>
              <Link href="/settings/preferences">
                <DropdownMenuItem className="cursor-pointer">
                  <Settings2 />
                  {t('preferences')}
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={async () => await signOut({ callbackUrl: '/login' })}
            >
              <LogOut />
              {tAuth('logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
