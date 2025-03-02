import PageContainer from '@/components/common/page-container';
import { dbGetAgentsByUserId } from '@/db/functions/agent';
import { getUser } from '@/utils/auth';

import AgentCard from './_components/agent-card';
import CreateAgentButton from './_components/create-agent-button';

export default async function Page() {
  const user = await getUser();
  const agents = await dbGetAgentsByUserId({ userId: user.id });

  return (
    <PageContainer className="mx-auto">
      <div className="flex flex-col gap-4 w-full">
        <h1 className="text-2xl font-semibold">Agents</h1>
        <p>
          "Agents" are custom AI assistants designed with a specific set of instructions tailored to
          perform particular tasks or solve particular problems.
        </p>
        <CreateAgentButton className="w-fit rounded-lg" />
        <div className="flex flex-col gap-4">
          {agents.length === 0 ? (
            <p>No agents found</p>
          ) : (
            agents.map((agent) => <AgentCard key={agent.id} agent={agent} />)
          )}
        </div>
      </div>
    </PageContainer>
  );
}
