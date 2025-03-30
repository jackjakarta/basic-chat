import { z } from 'zod';

export const newAgentSchema = z.object({
  name: z.string().min(1, 'Agent name is required'),
  instructions: z.string().min(1, 'Instructions are required'),
});
