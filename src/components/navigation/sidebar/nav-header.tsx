import { ThemeToggle } from '@/components/common/theme-toggle';
import ChatLogoIcon from '@/components/icons/logo';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import Link from 'next/link';

export function NavHeader() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          className="cursor-default bg-sidebar-accent text-sidebar-accent-foreground"
          size="lg"
          asChild
        >
          <Link href="#">
            <div className="grid flex-1 text-left text-sm leading-tight">
              <ChatLogoIcon className="-ml-0.5 h-24 w-24" />
            </div>
            <div className="flex items-center justify-center">
              <ThemeToggle />
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
