import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { type Message } from 'ai';
import { ChevronDown, Code } from 'lucide-react';

import MarkdownDisplay from './markdown-display/markdown-display';

export default function DisplayCodeExecution({
  message,
  status,
}: {
  message: Message;
  status: string;
}) {
  if (message.role === 'user') {
    return null;
  }

  return (
    <>
      {status === 'ready' &&
        message.parts?.[0]?.type === 'tool-invocation' &&
        message.parts?.[0]?.toolInvocation.toolName === 'executeCode' &&
        message.parts?.[0]?.toolInvocation.state === 'result' && (
          <Collapsible>
            <CollapsibleTrigger className="group mt-4 flex items-center gap-2 text-sm font-semibold">
              <Code className="mt-0.5 h-3.5 w-3.5 group-hover:text-primary-foreground/80" />
              <span className="group-hover:text-primary-foreground/80">View executed code</span>
              <span className="group-hover:text-primary-foreground/80">
                <ChevronDown className="mt-1 h-4 w-4 transition-transform duration-300 group-data-[state=open]:rotate-180" />
              </span>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="-mb-2 mt-2">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex flex-col items-center gap-2">
                    <MarkdownDisplay maxWidth={600}>
                      {message.parts[0].toolInvocation.result.formatedCode || 'No code executed.'}
                    </MarkdownDisplay>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
    </>
  );
}
