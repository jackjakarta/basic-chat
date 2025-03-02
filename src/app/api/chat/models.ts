import { env } from '@/env';
import { createOpenAI } from '@ai-sdk/openai';
import { customProvider } from 'ai';

import { imageModelsSchema, modelsSchema, type AIImageModel, type AIModel } from './types';

const openai = createOpenAI({
  apiKey: env.openaiApiKey,
});

export const defaultChatModel: AIModel = 'gpt-4.5-preview';
export const defaultImageModel: AIImageModel = 'dall-e-3';

const languageModels = Object.fromEntries(
  modelsSchema.options.map((model) => [model, openai(model)]),
);

const imageModels = Object.fromEntries(
  imageModelsSchema.options.map((model) => [model, openai.image(model)]),
);

export const myProvider = customProvider({
  languageModels,
  imageModels,
});
