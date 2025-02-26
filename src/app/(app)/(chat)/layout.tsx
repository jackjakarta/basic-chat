import Header from '@/components/common/header';
import { LlmModelProvider } from '@/components/hooks/use-llm-model';
import AppSidebar from '@/components/navigation/sidebar/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { getUser } from '@/utils/auth';

export const dynamic = 'force-dynamic';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  return (
    <SidebarProvider>
      <LlmModelProvider>
        <AppSidebar variant="sidebar" className="border-accent" user={user} />
        <SidebarInset>
          <Header />
          {children}
        </SidebarInset>
      </LlmModelProvider>
    </SidebarProvider>
  );
}
