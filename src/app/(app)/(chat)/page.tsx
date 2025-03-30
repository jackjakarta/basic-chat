import Chat from '@/components/chat/chat';
import { generateUUID } from '@/utils/uuid';

export const dynamic = 'force-dynamic';

export default function Page() {
  const id = generateUUID();

  return <Chat key={id} id={id} initialMessages={[]} />;
}
