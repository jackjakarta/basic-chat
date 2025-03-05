'use client';

import { createResource } from '@/app/api/chat/tools/rag';
import { useChat } from '@ai-sdk/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/rag',
    maxSteps: 3,
    body: { agentId: '902fc553-fc26-41dd-b12c-4f2fa25b7df4' },
  });

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <div className="space-y-4">
        {messages.map((m) => (
          <div key={m.id} className="whitespace-pre-wrap">
            <div>
              <div className="font-bold">{m.role}</div>
              <p>
                {m.content.length > 0 ? (
                  m.content
                ) : (
                  <span className="italic font-light animate-pulse">
                    {toolMapper(m?.toolInvocations?.[0]?.toolName)}
                  </span>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}

function toolMapper(inputString: string | undefined): string | undefined {
  if (inputString === undefined) {
    return undefined;
  }

  const mapping: Record<string, string> = {
    addResource: "I'll remember that...",
    getInformation: 'Looking it up...',
  };

  return mapping[inputString] ?? inputString;
}
