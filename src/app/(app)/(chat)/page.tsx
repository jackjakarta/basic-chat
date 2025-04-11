import Chat from '@/components/chat/chat';
import { getUser } from '@/utils/auth';
import { generateUUID } from '@/utils/uuid';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const user = await getUser();
  const id = generateUUID();

  return <Chat key={id} id={id} initialMessages={[]} userFirstName={user.firstName} />;
}
