import { z } from 'zod';

export const openaiModelsSchema = z.enum(['gpt-4o', 'gpt-4.1', 'gpt-4.1-mini']);
export const googleModelsSchema = z.enum(['gemini-2.5-pro-exp-03-25', 'gemini-2.0-flash']);
export const anthropicModelsSchema = z.enum(['claude-3-7-sonnet-20250219']);

const allModelOptions = [
  ...openaiModelsSchema.options,
  ...googleModelsSchema.options,
  ...anthropicModelsSchema.options,
] as const;

export const allModelsSchema = z.enum(allModelOptions);
