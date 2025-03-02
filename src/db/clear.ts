import { db } from '.';
import { conversationMessageTable, conversationTable } from './schema';

async function clearDb({ skip }: { skip: boolean }) {
  if (skip) {
    console.info({ warning: 'Skipping database clear. Set to false to clear the database' });
    return;
  }

  await db.transaction(async (tx) => {
    await tx.delete(conversationMessageTable);
    await tx.delete(conversationTable);
  });
}

clearDb({ skip: true })
  .then(() => {
    console.info('Database cleared');
    process.exit(0);
  })
  .catch((error) => {
    console.error({ error });
    process.exit(1);
  });
