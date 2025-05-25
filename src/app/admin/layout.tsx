import Header from '@/components/common/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { getUser } from '@/utils/auth';
import { getUserAvatarUrl } from '@/utils/user';
import { notFound } from 'next/navigation';

import AdminSidebar from './_components/sidebar/admin-sidebar';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  if (!user.isSuperAdmin) {
    return notFound();
  }

  const avatarUrl = getUserAvatarUrl({ email: user.email });

  return (
    <SidebarProvider>
      <AdminSidebar user={user} avatarUrl={avatarUrl} />
      <SidebarInset>
        <Header />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
