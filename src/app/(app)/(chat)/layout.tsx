import { defaultChatModel } from '@/app/api/chat/models';
import Header from '@/components/common/header';
import AppSidebar from '@/components/navigation/sidebar/app-sidebar';
import { LlmModelProvider } from '@/components/providers/llm-model';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { getUser } from '@/utils/auth';

export const dynamic = 'force-dynamic';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  return (
    <SidebarProvider>
      <LlmModelProvider defaultModel={defaultChatModel}>
        <AppSidebar user={user} />
        <SidebarInset>
          <Header modelsSelect />
          {children}
        </SidebarInset>
      </LlmModelProvider>
    </SidebarProvider>
  );
}
