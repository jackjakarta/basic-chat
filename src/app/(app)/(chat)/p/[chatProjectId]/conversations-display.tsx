'use client';

import { useConversationsQuery } from '@/components/hooks/use-conversations-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type ConversationRow } from '@/db/schema';
import Link from 'next/link';

export default function ConversationsDisplay({ chatProjectId }: { chatProjectId: string }) {
  const {
    data: conversations = [],
    isLoading,
    isError,
  } = useConversationsQuery({
    refetchOnWindowFocus: false,
  });

  const filteredConversations = conversations.filter((c) => c.chatProjectId === chatProjectId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading conversations.</div>;
  }

  if (conversations.length === 0) {
    return <div>No conversations found.</div>;
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <h2 className="mb-2 text-xl font-semibold">Conversations</h2>

      {filteredConversations.map((conversation) => (
        <ConversationCard key={conversation.id} conversation={conversation} />
      ))}
    </div>
  );
}

function ConversationCard({ conversation }: { conversation: ConversationRow }) {
  return (
    <Link href={`/p/${conversation.chatProjectId}/c/${conversation.id}`}>
      <Card className="flex w-full flex-col gap-0 px-4 py-3 hover:bg-accent/15">
        <CardHeader className="p-0">
          <CardTitle className="text-base">{conversation.name}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <span className="text-sm text-muted-foreground">
            This is a placeholder for conversation details.
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
