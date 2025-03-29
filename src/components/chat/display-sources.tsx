import { type Message } from 'ai';
import Link from 'next/link';

export default function DisplaySources({ message, status }: { message: Message; status: string }) {
  return (
    <div className="mt-4">
      {message?.parts?.[0]?.type === 'tool-invocation' &&
        message?.parts?.[0]?.toolInvocation.toolName === 'searchTheWeb' && (
          <span className="">Sources:</span>
        )}

      {status === 'ready' &&
        message?.parts?.[0]?.type === 'tool-invocation' &&
        message?.parts?.[0]?.toolInvocation.toolName === 'searchTheWeb' &&
        message.parts?.[0]?.toolInvocation.state === 'result' &&
        message.parts?.[0]?.toolInvocation.result?.sources?.map(
          // @ts-expect-error - weird typing
          (source) => (
            <div key={source.url} className="flex flex-col text-blue-400 gap-8 hover:underline">
              <Link href={source.url}>{source.title}</Link>
            </div>
          ),
        )}
    </div>
  );
}
