import { z } from 'zod';

export const modelsSchema = z.enum(['gpt-4o-mini', 'gpt-4o', 'gpt-4.5-preview', 'o3-mini']);
export type AIModel = z.infer<typeof modelsSchema>;

export const imageModelsSchema = z.enum(['dall-e-3']);
export type AIImageModel = z.infer<typeof imageModelsSchema>;
