import { ClientProvider } from '@/components/providers/client-provider';
import { LlmModelProvider } from '@/components/providers/llm-model';
import { dbGetEnabledModels } from '@/db/functions/ai-model';
import { getMaybeUserSession } from '@/utils/auth';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const [session, models] = await Promise.all([getMaybeUserSession(), dbGetEnabledModels()]);

  if (models.length === 0) {
    throw new Error('No models found');
  }

  const [firstModel] = models;

  if (firstModel === undefined) {
    throw new Error('No models found');
  }

  return (
    <ClientProvider session={session}>
      <LlmModelProvider defaultModel={firstModel.id}>{children}</LlmModelProvider>
    </ClientProvider>
  );
}
