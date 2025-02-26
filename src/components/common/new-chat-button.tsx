'use client';

import { cw } from '@/utils/tailwind';
import { MessageSquarePlus } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '../ui/button';

type NewChatButtonProps = React.ComponentPropsWithoutRef<'button'>;

export default function NewChatButton({ className, ...props }: NewChatButtonProps) {
  const router = useRouter();

  function handleNewChat() {
    router.push('/');
  }

  return (
    <Button
      variant="ghost"
      title="New Chat"
      size="icon"
      onClick={handleNewChat}
      className={cw('h-7 w-7', className)}
      {...props}
    >
      <MessageSquarePlus />
      <span className="sr-only">New Chat</span>
    </Button>
  );
}
