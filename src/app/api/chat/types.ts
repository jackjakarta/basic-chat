import { conversationRoleSchema } from '@/db/schema';
import { z } from 'zod';

export const chatMessageSchema = z.object({
  id: z.string(),
  content: z.string(),
  role: conversationRoleSchema,
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;
