import { env } from '@/env';
import { createOpenAI } from '@ai-sdk/openai';
import { customProvider } from 'ai';

import { modelsSchema, type AIModel } from './types';

const openai = createOpenAI({
  apiKey: env.openaiApiKey,
});

export const defaultChatModel: AIModel = 'gpt-4o';

const languageModels = Object.fromEntries(
  modelsSchema.options.map((model) => [model, openai(model)]),
);

export const myProvider = customProvider({
  languageModels,
});
