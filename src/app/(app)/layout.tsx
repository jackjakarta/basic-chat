import { LlmModelProvider } from '@/components/providers/llm-model';
import SessionProvider from '@/components/providers/session';
import { getMaybeUserSession } from '@/utils/auth';

import { defaultChatModel } from '../api/chat/models';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getMaybeUserSession();

  return (
    <SessionProvider session={session}>
      <LlmModelProvider defaultModel={defaultChatModel}>{children}</LlmModelProvider>
    </SessionProvider>
  );
}
