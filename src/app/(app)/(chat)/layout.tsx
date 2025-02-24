import SelectLlmModel from '@/components/chat/select-llm';
import { LlmModelProvider } from '@/components/hooks/use-llm-model';
import { AppSidebar } from '@/components/navigation/sidebar/app-sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { getUser } from '@/utils/auth';

export const dynamic = 'force-dynamic';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  return (
    <SidebarProvider>
      <LlmModelProvider>
        <AppSidebar user={user} />
        <SidebarInset>
          <div className="flex items-center gap-2">
            <SidebarTrigger className="ml-2 mt-2 p-4" />
            <SelectLlmModel />
          </div>
          {children}
        </SidebarInset>
      </LlmModelProvider>
    </SidebarProvider>
  );
}
