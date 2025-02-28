import { LlmModelProvider } from '@/components/providers/llm-model';
import SessionProvider from '@/components/providers/session';
import { getMaybeUserSession } from '@/utils/auth';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getMaybeUserSession();

  return (
    <SessionProvider session={session}>
      <LlmModelProvider>{children}</LlmModelProvider>
    </SessionProvider>
  );
}
