import { ModeToggle } from '@/components/common/dark-mode-toggle';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Building2 } from 'lucide-react';
import Link from 'next/link';

type NavHeaderProps = {
  organisationName: string;
  organisationType: string;
};

export function NavHeader({ organisationName, organisationType }: NavHeaderProps) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton className="hover:bg-transparent cursor-default" size="lg" asChild>
          <Link href="#">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Building2 className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{organisationName}</span>
              <span className="truncate text-xs">{organisationType}</span>
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
