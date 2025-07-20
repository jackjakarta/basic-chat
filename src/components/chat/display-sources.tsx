import { type Message } from 'ai';

import { SourceTag } from './source-tag';

export default function DisplaySources({ message, status }: { message: Message; status: string }) {
  if (message.role === 'user') {
    return null;
  }

  return (
    <div className="mt-4">
      {status === 'ready' &&
        message?.parts?.[0]?.type === 'tool-invocation' &&
        message?.parts?.[0]?.toolInvocation.toolName === 'searchTheWeb' &&
        message.parts?.[0]?.toolInvocation.state === 'result' && (
          <div className="flex flex-wrap items-center gap-2">
            {message.parts?.[0]?.toolInvocation.result?.sources?.map(
              // @ts-expect-error - weird typing
              (source) => <SourceTag key={source.url} url={source.url} title={source.title} />,
            )}
          </div>
        )}
    </div>
  );
}
