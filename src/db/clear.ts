import { db } from '.';
import { agentTable, conversationMessageTable, conversationTable, tokenTable } from './schema';

async function clearDb({ skip }: { skip: boolean }) {
  if (skip) {
    console.info({ warning: 'Skipping database clear. Set to false to clear the database' });
    return;
  }

  await db.transaction(async (tx) => {
    await tx.delete(conversationMessageTable);
    await tx.delete(conversationTable);
    await tx.delete(agentTable);
    await tx.delete(tokenTable);
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
