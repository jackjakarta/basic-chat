import { ClientProvider } from '@/components/providers/client-provider';
import { LlmModelProvider } from '@/components/providers/llm-model';
import { getMaybeUserSession } from '@/utils/auth';

import { defaultChatModel } from '../api/chat/models';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getMaybeUserSession();

  return (
    <ClientProvider session={session}>
      <LlmModelProvider defaultModel={defaultChatModel}>{children}</LlmModelProvider>
    </ClientProvider>
  );
}
