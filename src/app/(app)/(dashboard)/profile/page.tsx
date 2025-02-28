import PageContainer from '@/components/common/page-container';
import { getUser } from '@/utils/auth';

export default async function Page() {
  const user = await getUser();

  return (
    <PageContainer className="mx-auto">
      <div className="flex flex-col gap-4 w-full">
        <h1 className="text-2xl font-semibold">Agents</h1>
        <p>
          "Agents" are custom AI assistants designed with a specific set of instructions tailored to
          perform particular tasks or solve particular problems.
        </p>
        {/* <CreateAgentButton className="w-fit rounded-lg" /> */}
        <div className="space-y-4">
          {/* {agents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))} */}
        </div>
      </div>
    </PageContainer>
  );
}
