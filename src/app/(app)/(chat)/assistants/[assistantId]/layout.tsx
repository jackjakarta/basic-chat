import { dbGetAssistantById } from '@/db/functions/assistant';
import { getUser } from '@/utils/auth';
import { metadataTitle } from '@/utils/metadata';
import { type Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { assistantId: string };
}): Promise<Metadata> {
  const user = await getUser();
  const assistant = await dbGetAssistantById({ assistantId: params.assistantId, userId: user.id });

  return {
    title: `${metadataTitle} - ${assistant ? assistant.name : 'Assistants'}`,
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
