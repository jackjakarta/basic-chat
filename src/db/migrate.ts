import { env } from '@/env';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const databaseUrl = env.databaseUrl;

const databaseConnection = drizzle(postgres(databaseUrl, { max: 1 }));

async function main() {
  try {
    await migrate(databaseConnection, {
      migrationsFolder: './src/db/migrations',
    });
    console.log('Migration complete');
  } catch (error) {
    console.log(error);
  }
  process.exit(0);
}

main()
  .then(() => {})
  .catch(() => {});
