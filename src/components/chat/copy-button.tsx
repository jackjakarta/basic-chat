'use client';

import { cw } from '@/utils/tailwind';
import { CheckIcon, ClipboardIcon } from 'lucide-react';
import React from 'react';

export default function CopyButton({ text, index }: { text: string; index: number }) {
  const [copiedMessageIndex, setCopiedMessageIndex] = React.useState<number | null>(null);

  function handleCopy(text: string, index: number) {
    navigator.clipboard.writeText(text);
    setCopiedMessageIndex(index);

    setTimeout(() => {
      setCopiedMessageIndex(null);
    }, 1000);
  }

  return (
    <button
      title="Copy message"
      type="button"
      onClick={() => handleCopy(text, index)}
      className="rounded-full mt-1 "
      aria-label="Copy"
    >
      <div
        className={cw(
          'p-2 rounded-md hover:bg-secondary/65',
          'text-primary hover:text-primary',
          'dark:text-sidebar-accent hover:dark:text-sidebar-accent',
        )}
      >
        {copiedMessageIndex === index ? (
          <CheckIcon className="w-3.5 h-3.5" />
        ) : (
          <ClipboardIcon className="w-3.5 h-3.5" />
        )}
      </div>
    </button>
  );
}
