import Header from '@/components/common/header';
import PageContainer from '@/components/common/page-container';

import CreateAgentForm from './create-agent-form';

export default function Page() {
  return (
    <>
      <Header />
      <PageContainer className="mx-auto w-full">
        <div className="flex flex-col gap-8">
          <h1 className="text-2xl font-medium">Create Agent</h1>
          <CreateAgentForm />
        </div>
      </PageContainer>
    </>
  );
}
