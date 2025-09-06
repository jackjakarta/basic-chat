'use client';

import { buildConversationPath } from '@/components/chat/utils';
import { useIsMobile } from '@/components/hooks/use-mobile';
import { useToast } from '@/components/hooks/use-toast';
// import CheckIcon from '@/components/icons/check';
import DotsHorizontalIcon from '@/components/icons/dots-horizontal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenuSubButton, SidebarMenuSubItem } from '@/components/ui/sidebar';
import type { ChatProjectRow, ConversationRow } from '@/db/schema';
import { type WithConversations } from '@/db/types';
import { cw } from '@/utils/tailwind';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Check as CheckIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  deleteConversationAction,
  moveConversationToProjectAction,
  updateConversationTitleAction,
} from './actions';

const renameSchema = z.object({
  name: z.string().min(1),
});

type FormData = z.infer<typeof renameSchema>;

type ConversationItemProps = {
  conversation: ConversationRow;
  chatProjects: WithConversations<ChatProjectRow>[];
  onClickMobile?: () => void;
};

export default function ConversationItem({
  conversation,
  chatProjects,
  onClickMobile,
}: ConversationItemProps) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [editMode, setEditMode] = React.useState(false);
  const { toastSuccess, toastError, toastLoading } = useToast();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(renameSchema),
    defaultValues: { name: conversation.name ?? '' },
  });

  function refetchConversations() {
    queryClient.invalidateQueries({ queryKey: ['conversations'] });
    queryClient.invalidateQueries({ queryKey: ['chat-projects'] });
  }

  async function onSubmit(data: FormData) {
    if (isDirty) {
      toastLoading('Saving conversation name');
    }

    try {
      await updateConversationTitleAction({ conversationId: conversation.id, title: data.name });

      if (isDirty) {
        toastSuccess('Saved conversation name');
      }
    } catch (error) {
      console.error({ error });
      toastError('Failed to save conversation name');
    } finally {
      setEditMode(false);
      refetchConversations();
    }
  }

  async function handleDeleteConversation(conversationId: string) {
    toastLoading('Deleting conversation');

    try {
      await deleteConversationAction({ conversationId });
      toastSuccess('Deleted conversation');

      if (pathname.includes(conversationId)) {
        router.replace('/');
      }
    } catch (error) {
      console.error({ error });
      toastError('Failed to delete conversation');
    } finally {
      refetchConversations();
    }
  }

  async function handleMoveConversationToProject(
    conversationId: string,
    chatProjectId: string | null,
  ) {
    toastLoading('Moving conversation');

    try {
      await moveConversationToProjectAction({ conversationId, chatProjectId });
      toastSuccess('Moved conversation');
    } catch (error) {
      console.error({ error });
      toastError('Failed to move conversation');
    } finally {
      refetchConversations();
    }
  }

  return (
    <SidebarMenuSubItem key={conversation.id} className="group/item">
      <SidebarMenuSubButton
        asChild
        className={cw(
          'pl-2 pr-0.5',
          !editMode ? 'hover:bg-sidebar-accent/90' : 'hover:bg-transparent active:bg-transparent',
          pathname.includes(conversation.id) && !editMode && 'bg-sidebar-accent',
        )}
      >
        <div className="flex w-full items-center justify-between">
          {editMode && (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="-ml-2 flex flex-1 items-center gap-2"
            >
              <input
                {...register('name')}
                autoFocus
                className="w-full rounded-sm py-1 pl-2 pr-1 focus:outline-none"
                onBlur={() => handleSubmit(onSubmit)()}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="py-2 focus:outline-none"
                aria-label="Save name"
              >
                <CheckIcon className="h-5 w-5" />
              </button>
            </form>
          )}

          {!editMode && (
            <>
              <Link
                onClick={onClickMobile}
                href={buildConversationPath({
                  chatId: conversation.id,
                  chatProjectId: conversation.chatProjectId ?? undefined,
                  assistantId: conversation.assistantId ?? undefined,
                })}
                className="flex-1 truncate"
              >
                <span>{conversation.name ?? 'New Chat'}</span>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={cw(
                      'p-2 focus:outline-none',
                      !isMobile && 'invisible group-hover/item:visible',
                    )}
                    aria-label="Open menu"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <DotsHorizontalIcon />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className={cw('rounded-md shadow-sm')}
                  align="start"
                  sideOffset={5}
                >
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      setEditMode(true);
                    }}
                    className="cursor-pointer"
                  >
                    Edit
                  </DropdownMenuItem>

                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="cursor-pointer">
                      Move to project
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className={cw('rounded-md shadow-sm')}>
                      {conversation.chatProjectId === null && (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.preventDefault();
                            handleMoveConversationToProject(conversation.id, null);
                          }}
                          className="cursor-pointer"
                        >
                          <span>No project</span>
                          <CheckIcon className="ml-2 size-4 text-white" />
                        </DropdownMenuItem>
                      )}
                      {chatProjects.length > 0 ? (
                        chatProjects
                          // .filter((p) => p.id !== conversation.chatProjectId)
                          .map((project) => (
                            <DropdownMenuItem
                              key={project.id}
                              onClick={(e) => {
                                e.preventDefault();
                                handleMoveConversationToProject(conversation.id, project.id);
                              }}
                              className="cursor-pointer"
                            >
                              <span>{project.name}</span>
                              {conversation.chatProjectId === project.id && (
                                <CheckIcon className="size-4 text-foreground" />
                              )}
                            </DropdownMenuItem>
                          ))
                      ) : (
                        <span className="px-1 text-xs dark:opacity-70">No projects yet</span>
                      )}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      handleDeleteConversation(conversation.id);
                    }}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
}
