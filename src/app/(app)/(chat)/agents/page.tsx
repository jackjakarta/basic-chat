import PageContainer from '@/components/common/page-container';
import { dbGetAgentsByUserId } from '@/db/functions/agent';
import { getUser } from '@/utils/auth';
import { getTranslations } from 'next-intl/server';

import AgentCard from './_components/agent-card';
import CreateAgentButton from './_components/create-agent-button';

export default async function Page() {
  const user = await getUser();

  const [agents, t] = await Promise.all([
    dbGetAgentsByUserId({ userId: user.id }),
    getTranslations('agents'),
  ]);

  return (
    <PageContainer className="mx-auto">
      <div className="flex flex-col gap-6 w-full">
        <h1 className="text-2xl font-semibold">{t('title')}</h1>
        <p>{t('description')}</p>
        <CreateAgentButton className="w-fit rounded-lg bg-accent hover:bg-accent/90 text-secondary-foreground active:bg-accent/90" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
