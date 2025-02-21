import { openai } from '@ai-sdk/openai';
import { customProvider } from 'ai';
import { z } from 'zod';

export const modelsSchema = z.enum(['gpt-4o-mini', 'gpt-4o']);
export type AIModel = z.infer<typeof modelsSchema>;

export const DEFAULT_CHAT_MODEL: AIModel = 'gpt-4o-mini';

const languageModels = Object.fromEntries(
  modelsSchema.options.map((model) => [model, openai(model)]),
);

export const myProvider = customProvider({
  languageModels,
});
