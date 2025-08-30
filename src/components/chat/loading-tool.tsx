import { toolNameMap } from '@/utils/chat';
import { type Message } from 'ai';
import { Braces, File, Globe2, Image as ImageIcon } from 'lucide-react';

import LoadingText from '../common/loading-text';
import NotionIcon from '../icons/notion';

type LoadingToolProps = {
  message: Message;
};

type KnownTool = 'searchNotion' | 'generateImage' | 'searchFiles' | 'executeCode' | 'searchTheWeb';

const TOOL_CONFIG: Record<KnownTool, { text: string; icon: JSX.Element }> = {
  searchNotion: { text: 'Searching notion...', icon: <NotionIcon className="size-4" /> },
  generateImage: { text: 'Generating image...', icon: <ImageIcon className="size-4" /> },
  searchFiles: { text: 'Searching my knowledge...', icon: <File className="size-4" /> },
  executeCode: { text: 'Executing code...', icon: <Braces className="size-4" /> },
  searchTheWeb: { text: 'Searching the web...', icon: <Globe2 className="size-4" /> },
};

export default function LoadingTool({ message }: LoadingToolProps) {
  const firstPart = message?.parts?.[0];
  const isToolInvocation = firstPart?.type === 'tool-invocation';
  const toolName = isToolInvocation ? firstPart?.toolInvocation?.toolName : '';

  const config = (toolName && TOOL_CONFIG[toolName as KnownTool]) || null;

  if (config === null) {
    return <LoadingText>{toolNameMap(toolName) ?? ''}</LoadingText>;
  }

  return <LoadingToolWithIcon text={config.text} icon={config.icon} />;
}

function LoadingToolWithIcon({ text, icon }: { text: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="animate-pulse">{icon}</span>
      <LoadingText>{text}</LoadingText>
    </div>
  );
}
