import {
  awsDocsMcpToolMap,
  awsDocsMcpToolsSchema,
  type AwsDocsMcpTools,
} from '@/app/api/chat/mcp/aws/utils';
import {
  githubMcpToolMap,
  githubMcpToolsSchema,
  type GithubMcpTools,
} from '@/app/api/chat/mcp/github/utils';
import { toolNameMap } from '@/utils/chat';
import { type Message } from 'ai';
import { Braces, File, Globe2, Image as ImageIcon } from 'lucide-react';

import LoadingText from '../common/loading-text';
import AwsIcon from '../icons/aws';
import GithubIcon from '../icons/github';
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

  const isGithubTool =
    message?.parts?.[0]?.type === 'tool-invocation' &&
    githubMcpToolsSchema.options.includes(
      message?.parts?.[0]?.toolInvocation?.toolName as GithubMcpTools,
    );

  const isAwsDocsTool =
    message?.parts?.[0]?.type === 'tool-invocation' &&
    awsDocsMcpToolsSchema.options.includes(
      message?.parts?.[0]?.toolInvocation?.toolName as AwsDocsMcpTools,
    );

  const isFileSearchTool =
    message?.parts?.[0]?.type === 'tool-invocation' &&
    message?.parts?.[0]?.toolInvocation?.toolName === 'searchFiles';

  const isCodeExecutionTool =
    message?.parts?.[0]?.type === 'tool-invocation' &&
    message?.parts?.[0]?.toolInvocation?.toolName === 'executeCode';

  const isWebSearchTool =
    message?.parts?.[0]?.type === 'tool-invocation' &&
    message?.parts?.[0]?.toolInvocation?.toolName === 'searchTheWeb';

  if (isNotionTool) {
    return (
      <LoadingToolWithIcon text="Searching notion..." icon={<NotionIcon className="w-4 h-4" />} />
    );
  }

  if (isImageGenerationTool) {
    return (
      <LoadingToolWithIcon text="Generating image..." icon={<ImageIcon className="w-4 h-4" />} />
    );
  }

  if (isGithubTool) {
    const toolName =
      message?.parts?.[0]?.type === 'tool-invocation'
        ? message?.parts?.[0]?.toolInvocation?.toolName
        : undefined;

    return (
      <LoadingToolWithIcon
        text={githubMcpToolMap[toolName as GithubMcpTools] ?? 'Using Github integration...'}
        icon={<GithubIcon className="w-4 h-4" />}
      />
    );
  }

  if (isAwsDocsTool) {
    const toolName =
      message?.parts?.[0]?.type === 'tool-invocation'
        ? message?.parts?.[0]?.toolInvocation?.toolName
        : undefined;

    return (
      <LoadingToolWithIcon
        text={awsDocsMcpToolMap[toolName as AwsDocsMcpTools] ?? 'Using AWS docs integration...'}
        icon={<AwsIcon className="w-4 h-4" />}
      />
    );
  }

  if (isFileSearchTool) {
    return (
      <LoadingToolWithIcon text="Searching my knowledge..." icon={<File className="w-4 h-4" />} />
    );
  }

  if (isCodeExecutionTool) {
    return <LoadingToolWithIcon text="Executing code..." icon={<Braces className="w-4 h-4" />} />;
  }

  if (isWebSearchTool) {
    return (
      <LoadingToolWithIcon text="Searching the web..." icon={<Globe2 className="w-4 h-4" />} />
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
