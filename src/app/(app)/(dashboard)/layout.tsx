import Header from '@/components/common/header';
import AppSidebar from '@/components/navigation/sidebar/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { getUser } from '@/utils/auth';
import { getUserAvatarUrl } from '@/utils/user';
import { getTranslations } from 'next-intl/server';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const [user, t] = await Promise.all([getUser(), getTranslations('settings')]);
  const avatarUrl = getUserAvatarUrl({ email: user.email });

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar user={user} avatarUrl={avatarUrl} />
      <SidebarInset>
        <Header assistantName={t('title')} />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
