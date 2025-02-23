import { type Message } from '@ai-sdk/react';
import React from 'react';

export function useChatOptions({ messages }: { messages: Message[] }) {
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const [isCopied, setIsCopied] = React.useState(false);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  }

  return { scrollRef, isCopied, handleCopy };
}
