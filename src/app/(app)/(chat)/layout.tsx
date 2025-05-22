import Header from '@/components/common/header';
import AppSidebar from '@/components/navigation/sidebar/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { dbGetEnabledModels } from '@/db/functions/ai-model';
import { getUser } from '@/utils/auth';
import { getUserAvatarUrl } from '@/utils/user';

export const dynamic = 'force-dynamic';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const [user, models] = await Promise.all([getUser(), dbGetEnabledModels()]);

  const avatarUrl = getUserAvatarUrl({ email: user.email });

  return (
    <SidebarProvider>
      <AppSidebar user={user} avatarUrl={avatarUrl} />
      <SidebarInset>
        <Header models={models} />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
