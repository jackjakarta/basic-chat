import { ClientProvider } from '@/components/providers/client';
import { LlmModelProvider } from '@/components/providers/llm-model';
import { dbGetEnabledModels } from '@/db/functions/ai-model';
import { getMaybeUserSession } from '@/utils/auth';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const [session, models] = await Promise.all([getMaybeUserSession(), dbGetEnabledModels()]);

  if (models.length === 0) {
    throw new Error('No models found');
  }

  const [defaultModel] = models.filter((model) => model.isDefault);

  if (defaultModel === undefined) {
    throw new Error('No default model found');
  }

  return (
    <ClientProvider session={session}>
      <LlmModelProvider defaultModel={defaultModel.id}>{children}</LlmModelProvider>
    </ClientProvider>
  );
}
