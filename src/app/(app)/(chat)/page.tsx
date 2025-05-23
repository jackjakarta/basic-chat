import Chat from '@/components/chat/chat';
import { dbGetEnabledModels } from '@/db/functions/ai-model';
import { getUser } from '@/utils/auth';
import { generateUUID } from '@/utils/uuid';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const [user, models] = await Promise.all([getUser(), dbGetEnabledModels()]);
  const id = generateUUID();

  return (
    <Chat key={id} id={id} initialMessages={[]} userFirstName={user.firstName} models={models} />
  );
}
