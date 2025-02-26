'use client';

import { Check, Clipboard } from 'lucide-react';
import React from 'react';

export default function ClipboardButton({ text }: { text: string }) {
  const [isCopied, setIsCopied] = React.useState(false);

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  }

  return (
    <button
      className="p-1 hover:bg-secondary/40 rounded-md"
      onClick={() => handleCopy(text)}
      disabled={isCopied}
    >
      {isCopied ? <Check className="w-4 h-4" /> : <Clipboard className="w-4 h-4" />}
    </button>
  );
}
