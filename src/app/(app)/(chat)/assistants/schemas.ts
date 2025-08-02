import { z } from 'zod';

export const newAssistantSchema = z.object({
  name: z.string().min(1, 'Assistant name is required'),
});
