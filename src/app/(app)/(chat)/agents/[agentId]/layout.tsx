import { dbGetAgentById } from '@/db/functions/agent';
import { getUser } from '@/utils/auth';
import { metadataTitle } from '@/utils/metadata';
import { type Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { agentId: string };
}): Promise<Metadata> {
  const user = await getUser();
  const agent = await dbGetAgentById({ agentId: params.agentId, userId: user.id });

  return {
    title: `${metadataTitle} - ${agent ? agent.name : 'Agents'}`,
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
