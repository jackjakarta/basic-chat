import { z } from 'zod';

import { allModelsSchema } from './schemas';

export type AIModel = z.infer<typeof allModelsSchema>;
