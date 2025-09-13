import ContactForm from '@/components/common/contact-form';
import ShortcutsDialog from '@/components/common/shortcuts-dialog';
import GithubIcon from '@/components/icons/github';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Command, Mail } from 'lucide-react';
import Link from 'next/link';

const menuItems = [
  {
    title: 'GitHub',
    url: 'https://github.com/jackjakarta/basic-chat',
    icon: GithubIcon,
  },
];

export function NavSecondary({ ...props }: React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <ShortcutsDialog
              trigger={
                <SidebarMenuButton className="cursor-pointer" size="sm">
                  <Command />
                  <span>Shortcuts</span>
                </SidebarMenuButton>
              }
            />
          </SidebarMenuItem>

          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild size="sm">
                <Link href={item.url} target="_blank">
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}

          <SidebarMenuItem>
            <ContactForm
              trigger={
                <SidebarMenuButton className="cursor-pointer" size="sm">
                  <Mail />
                  <span>Contact</span>
                </SidebarMenuButton>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
