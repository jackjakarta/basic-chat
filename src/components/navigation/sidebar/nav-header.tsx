import { ModeToggle } from '@/components/common/dark-mode-toggle';
import ChatLogoIcon from '@/components/icons/logo';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import Link from 'next/link';

export function NavHeader() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton className="hover:bg-transparent cursor-default" size="lg" asChild>
          <Link href="#">
            <div className="grid flex-1 text-left text-sm leading-tight">
              <ChatLogoIcon className="w-24 h-24 -ml-0.5" />
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
