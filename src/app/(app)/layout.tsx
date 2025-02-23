import { AppSidebar } from '@/components/navigation/sidebar/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { dbGetConversations } from '@/db/functions/chat';
import { getUser } from '@/utils/auth';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  const conversations = await dbGetConversations({ userId: user.id });

  return (
    <SidebarProvider>
      <AppSidebar user={user} conversations={conversations} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
