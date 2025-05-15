import { db } from '@/db';

import { aiModelTable } from '../schema';
import { models } from './models';

async function seedAIModels({ skip = true }: { skip: boolean }) {
  if (skip) {
    console.info({ info: 'Skipping AI models seeding' });
    return;
  }

  const insertedModels = await db.insert(aiModelTable).values(models).returning();

  if (insertedModels.length === 0) {
    console.error({ error: 'Failed to insert AI models' });
    return;
  }

  console.info({ insertedModels });
}

seedAIModels({ skip: false })
  .then(() => {
    console.info({ info: 'AI models seeding completed' });
    process.exit(0);
  })
  .catch((error: unknown) => {
    console.error({ error: 'AI models seeding failed', details: error });
    process.exit(1);
  });
