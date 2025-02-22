import { AppSidebar } from '@/components/navigation/sidebar/app-sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { getValidSession } from '@/utils/auth';

export default async function Layout({ children }: { children: React.ReactNode }) {
  await getValidSession();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
