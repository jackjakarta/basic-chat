'use client';

import { cw } from '@/utils/tailwind';
import { MessageSquarePlus } from 'lucide-react';
import Link from 'next/link';

import { Button } from '../ui/button';

type NewChatButtonProps = React.ComponentPropsWithoutRef<typeof Button>;

export default function NewChatButton({ className, ...props }: NewChatButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      title="New Chat"
      size="icon"
      className={cw('h-7 w-7', className)}
      {...props}
      asChild
    >
      <Link href={'/'}>
        <MessageSquarePlus />
        <span className="sr-only">New Chat</span>
      </Link>
    </Button>
  );
}
