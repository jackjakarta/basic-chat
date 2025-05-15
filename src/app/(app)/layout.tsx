import { ClientProvider } from '@/components/providers/client-provider';
import { LlmModelProvider } from '@/components/providers/llm-model';
import { dbGetEnabledModels } from '@/db/functions/ai-model';
import { getMaybeUserSession } from '@/utils/auth';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const [session, models] = await Promise.all([getMaybeUserSession(), dbGetEnabledModels()]);

  if (models.length === 0) {
    throw new Error('No models found');
  }

  const firstModel = models.filter((model) => model.id === 'gpt-4.1')[0];

  return (
    <ClientProvider session={session}>
      <LlmModelProvider defaultModel={firstModel?.id ?? 'gpt-4.1'}>{children}</LlmModelProvider>
    </ClientProvider>
  );
}
