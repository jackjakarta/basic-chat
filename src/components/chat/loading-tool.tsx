import { toolNameMap } from '@/utils/chat';
import { type Message } from 'ai';
import { Braces, File, Globe2, Image as ImageIcon } from 'lucide-react';

import LoadingText from '../common/loading-text';
import NotionIcon from '../icons/notion';

type LoadingToolProps = {
  message: Message;
};

export default function LoadingTool({ message }: LoadingToolProps) {
  const isNotionTool =
    message?.parts?.[0]?.type === 'tool-invocation' &&
    message?.parts?.[0]?.toolInvocation?.toolName === 'searchNotion';

  const isImageGenerationTool =
    message?.parts?.[0]?.type === 'tool-invocation' &&
    message?.parts?.[0]?.toolInvocation?.toolName === 'generateImage';

  const isAssistantFileSearchTool =
    message?.parts?.[0]?.type === 'tool-invocation' &&
    message?.parts?.[0]?.toolInvocation?.toolName === 'assistantSearchFiles';

  const isCodeExecutionTool =
    message?.parts?.[0]?.type === 'tool-invocation' &&
    message?.parts?.[0]?.toolInvocation?.toolName === 'executeCode';

  const isWebSearchTool =
    message?.parts?.[0]?.type === 'tool-invocation' &&
    message?.parts?.[0]?.toolInvocation?.toolName === 'searchTheWeb';

  if (isNotionTool) {
    return (
      <LoadingToolWithIcon text="Searching notion..." icon={<NotionIcon className="h-4 w-4" />} />
    );
  }

  if (isImageGenerationTool) {
    return (
      <LoadingToolWithIcon text="Generating image..." icon={<ImageIcon className="h-4 w-4" />} />
    );
  }

  if (isAssistantFileSearchTool) {
    return (
      <LoadingToolWithIcon text="Searching my knowledge..." icon={<File className="h-4 w-4" />} />
    );
  }

  if (isCodeExecutionTool) {
    return <LoadingToolWithIcon text="Executing code..." icon={<Braces className="h-4 w-4" />} />;
  }

  if (isWebSearchTool) {
    return (
      <LoadingToolWithIcon text="Searching the web..." icon={<Globe2 className="h-4 w-4" />} />
    );
  }

  const toolName =
    message?.parts?.[0]?.type === 'tool-invocation'
      ? message?.parts?.[0]?.toolInvocation?.toolName
      : '';

  return <LoadingText>{toolNameMap(toolName) ?? ''}</LoadingText>;
}

function LoadingToolWithIcon({ text, icon }: { text: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="animate-pulse">{icon}</span>
      <LoadingText>{text}</LoadingText>
    </div>
  );
}
