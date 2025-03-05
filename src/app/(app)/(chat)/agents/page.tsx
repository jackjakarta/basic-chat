import PageContainer from '@/components/common/page-container';
import { dbGetAgentsByUserId } from '@/db/functions/agent';
import { getUser } from '@/utils/auth';
import { getTranslations } from 'next-intl/server';

import AgentCard from './_components/agent-card';
import CreateAgentButton from './_components/create-agent-button';

export default async function Page() {
  const user = await getUser();
  const agents = await dbGetAgentsByUserId({ userId: user.id });
  const t = await getTranslations('agents');

  return (
    <PageContainer className="mx-auto">
      <div className="flex flex-col gap-4 w-full">
        <h1 className="text-2xl font-semibold">{t('title')}</h1>
        <p>{t('description')}</p>
        <CreateAgentButton className="w-fit rounded-lg" />
        <div className="flex flex-col gap-4">
          {agents.length === 0 ? (
            <span className="text-sm text-muted-foreground">{t('no-agents')}</span>
          ) : (
            agents.map((agent) => <AgentCard key={agent.id} agent={agent} />)
          )}
        </div>
      </div>
    </PageContainer>
  );
}
