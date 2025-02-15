import Chat from '@/components/chat/chat';
import { dbGetConversationById, dbGetCoversationMessages } from '@/db/functions/chat';
import { getUser } from '@/utils/auth';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: { chatId: string } }) {
  const conversationId = params.chatId;
  const [chat, user] = await Promise.all([dbGetConversationById({ conversationId }), getUser()]);

  if (chat === undefined) {
    return notFound();
  }

  const rawChatMessages = await dbGetCoversationMessages({
    conversationId: chat.id,
    userId: user.id,
  });

  return <Chat key={chat.id} id={chat.id} initialMessages={rawChatMessages} />;
}
