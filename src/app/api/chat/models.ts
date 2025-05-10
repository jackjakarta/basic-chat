import { env } from '@/env';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { customProvider } from 'ai';

import { anthropicModelsSchema, googleModelsSchema, openaiModelsSchema } from './schemas';
import { type AIModel } from './types';

export const defaultChatModel: AIModel = 'gpt-4.1';

const anthropic = createAnthropic({
  apiKey: env.anthropicApiKey,
});

const openai = createOpenAI({
  apiKey: env.openaiApiKey,
});

const google = createGoogleGenerativeAI({
  apiKey: env.geminiApiKey,
});

const languageModels = {
  ...Object.fromEntries(openaiModelsSchema.options.map((model) => [model, openai(model)])),
  ...Object.fromEntries(googleModelsSchema.options.map((model) => [model, google(model)])),
  ...Object.fromEntries(anthropicModelsSchema.options.map((model) => [model, anthropic(model)])),
};

export const myProvider = customProvider({
  languageModels,
});
