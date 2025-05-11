import { env } from '@/env';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createMistral } from '@ai-sdk/mistral';
import { createOpenAI } from '@ai-sdk/openai';
import { customProvider } from 'ai';

import {
  anthropicModelsSchema,
  googleModelsSchema,
  mistralModelsSchema,
  openaiModelsSchema,
} from './schemas';
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

const mistral = createMistral({
  apiKey: env.mistralApiKey,
});

const languageModels = {
  ...Object.fromEntries(openaiModelsSchema.options.map((model) => [model, openai(model)])),
  ...Object.fromEntries(googleModelsSchema.options.map((model) => [model, google(model)])),
  ...Object.fromEntries(anthropicModelsSchema.options.map((model) => [model, anthropic(model)])),
  ...Object.fromEntries(mistralModelsSchema.options.map((model) => [model, mistral(model)])),
};

export const customModelProvider = customProvider({
  languageModels,
});
