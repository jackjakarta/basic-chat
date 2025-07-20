import PageContainer from '@/components/common/page-container';
import { getUser } from '@/utils/auth';

import SettingsNav from './_components/settings-nav';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  return (
    <PageContainer className="mx-auto w-full">
      <div className="flex max-h-dvh flex-col items-start gap-4 md:flex-row">
        <SettingsNav userSubscription={user.subscription} />
        <div className="flex flex-1 flex-col gap-4">{children}</div>
      </div>
    </PageContainer>
  );
}
