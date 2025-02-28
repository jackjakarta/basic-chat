import { ModeToggle } from '@/components/common/dark-mode-toggle';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type ObscuredUser } from '@/utils/user';
import { User2 } from 'lucide-react';
import Link from 'next/link';

export function NavHeader({ firstName, lastName, email }: ObscuredUser) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton className="hover:bg-transparent cursor-default" size="lg" asChild>
          <Link href="#">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <User2 className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">
                {firstName} {lastName}
              </span>
              <span className="truncate text-xs">{email}</span>
            </div>
            <div className="flex items-center justify-center">
              <ModeToggle />
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
