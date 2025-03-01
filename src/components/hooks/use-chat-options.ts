import { type Message } from '@ai-sdk/react';
import React from 'react';

export function useChatOptions({ messages }: { messages: Message[] }) {
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const [copiedMessageIndex, setCopiedMessageIndex] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  function handleCopy(text: string, index: number) {
    navigator.clipboard.writeText(text);
    setCopiedMessageIndex(index);

    setTimeout(() => {
      setCopiedMessageIndex(null);
    }, 1000);
  }

  return { scrollRef, copiedMessageIndex, handleCopy };
}
