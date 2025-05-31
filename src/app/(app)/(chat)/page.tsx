import Chat from '@/components/chat/chat';
import { dbGetEnabledModels } from '@/db/functions/ai-model';
import { dbGetAmountOfTokensUsedByUserId } from '@/db/functions/usage';
import { getUser } from '@/utils/auth';
import { generateUUID } from '@/utils/uuid';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const id = generateUUID();

  const [user, models] = await Promise.all([getUser(), dbGetEnabledModels()]);
  const tokensUsed = await dbGetAmountOfTokensUsedByUserId({ userId: user.id });

  return (
    <Chat
      key={id}
      id={id}
      initialMessages={[]}
      userFirstName={user.firstName}
      models={models}
      tokensUsed={tokensUsed}
    />
  );
}
