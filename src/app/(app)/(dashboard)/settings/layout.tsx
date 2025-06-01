import PageContainer from '@/components/common/page-container';
import { getUser } from '@/utils/auth';

import SettingsNav from './_components/settings-nav';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  return (
    <PageContainer className="mx-auto w-full">
      <div className="flex flex-col md:flex-row items-start gap-4 max-h-dvh">
        <SettingsNav userSubscription={user.subscription} />
        <div className="flex flex-col flex-1 gap-4">{children}</div>
      </div>
    </PageContainer>
  );
}
