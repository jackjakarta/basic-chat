import AppSidebar from '@/components/navigation/sidebar/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { getUser } from '@/utils/auth';
import { getSidebarOpenStateFromCookies } from '@/utils/cookies';
import { getUserAvatarUrl } from '@/utils/user';

export const dynamic = 'force-dynamic';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  const avatarUrl = getUserAvatarUrl({ email: user.email });
  const isSidebarOpen = getSidebarOpenStateFromCookies();

  return (
    <SidebarProvider defaultOpen={isSidebarOpen}>
      <AppSidebar user={user} avatarUrl={avatarUrl} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
