import { db } from '@/db';

import { aiModelTable } from '../schema';
import { models } from './models';

async function seedAIModels({ skip = true }: { skip: boolean }) {
  if (skip) {
    console.info({ info: 'Skipping AI models seeding' });
    return;
  }

  for (const model of models) {
    const insertedModel = await db
      .insert(aiModelTable)
      .values(model)
      .onConflictDoUpdate({ target: aiModelTable.id, set: { id: model.id } });

    console.info({ insertedModel });
  }
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
