import PageContainer from '@/components/common/page-container';

import SettingsNav from './_components/settings-nav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PageContainer className="mx-auto w-full">
      <div className="flex flex-col md:flex-row items-start gap-4">
        <SettingsNav />
        <div className="flex flex-col flex-1 gap-4">{children}</div>
      </div>
    </PageContainer>
  );
}
