'use client';

import { useChatProjectsQuery } from '@/components/hooks/use-chat-projects-query';
import { type ChatProjectWithConversations } from '@/db/functions/chat-project';
import { getAllowedIcon } from '@/utils/icons';
import { cw, iconColorToTailwind } from '@/utils/tailwind';
import Link from 'next/link';

export default function ChatProjectsDisplay() {
  const { data: chatProjects = [] } = useChatProjectsQuery({
    refetchOnWindowFocus: false,
  });

  if (chatProjects.length === 0) {
    const Icon = getAllowedIcon('MessageSquare');

    return (
      <div className="flex flex-col items-center justify-center px-4 py-12">
        <div className="mb-4 rounded-full bg-muted p-4">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">No chat projects yet</h3>
        <p className="max-w-sm text-center text-sm text-muted-foreground">
          Create your first chat project to get started with organized conversations.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {chatProjects.map((project) => (
        <ChatProjectCard key={project.id} project={project as ChatProjectWithConversations} />
      ))}
    </div>
  );
}

function ChatProjectCard({ project }: { project: ChatProjectWithConversations }) {
  const IconComponent = getAllowedIcon(project.icon);
  const conversationCount = project.conversations?.length || 0;

  return (
    <Link href={`/p/${project.id}`}>
      <div className="group relative cursor-pointer overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:border-border/80 hover:shadow-md">
        <div className="p-6">
          {/* Header with icon and title */}
          <div className="mb-4 flex items-start gap-3">
            <div
              className={cw(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                iconColorToTailwind(project.iconColor),
              )}
            >
              <IconComponent className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-balance font-semibold leading-tight text-foreground">
                {project.name}
              </h3>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {conversationCount} conversation{conversationCount !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>

          {/* System prompt preview */}
          {project.systemPrompt && (
            <div className="mb-4">
              <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                {project.systemPrompt}
              </p>
            </div>
          )}

          {/* Footer with metadata */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
            {project.updatedAt !== project.createdAt && (
              <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
            )}
          </div>
        </div>

        {/* Subtle hover effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-muted/5 opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
    </Link>
  );
}
