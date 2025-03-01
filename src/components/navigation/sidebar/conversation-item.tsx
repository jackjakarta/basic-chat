'use client';

import { useIsMobile } from '@/components/hooks/use-mobile';
import { useToast } from '@/components/hooks/use-toast';
import CheckIcon from '@/components/icons/check';
import DotsHorizontalIcon from '@/components/icons/dots-horizontal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenuSubButton, SidebarMenuSubItem } from '@/components/ui/sidebar';
import { type ConversationRow } from '@/db/schema';
import { cw } from '@/utils/tailwind';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { mutate } from 'swr';
import { z } from 'zod';

import { deleteConversationAction, updateConversationTitle } from './actions';

const renameSchema = z.object({
  name: z.string().min(1),
});

type FormData = z.infer<typeof renameSchema>;

type ConversationItemProps = {
  conversation: ConversationRow;
  onClickMobile?: () => void;
};

export default function ConversationItem({ conversation, onClickMobile }: ConversationItemProps) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const router = useRouter();
  const { toastSuccess, toastError, toastLoading, removeToast } = useToast();

  const [editMode, setEditMode] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(renameSchema),
    defaultValues: { name: conversation.name ?? '' },
  });

  async function onSubmit(data: FormData) {
    toastLoading('Saving conversation name');

    try {
      await updateConversationTitle({ conversationId: conversation.id, title: data.name });
      removeToast();
      toastSuccess('Saved conversation name');
    } catch (error) {
      console.error({ error });
      removeToast();
      toastError('Failed to save conversation name');
    } finally {
      mutate('/api/conversations');
      setEditMode(false);
    }
  }

  async function handleDeleteConversation(conversationId: string) {
    toastLoading('Deleting conversation');

    try {
      await deleteConversationAction({ conversationId });
      removeToast();
      toastSuccess('Deleted conversation');

      if (pathname.includes(conversationId)) {
        router.replace('/');
      }
    } catch (error) {
      console.error({ error });
      removeToast();
      toastError('Failed to delete conversation');
    } finally {
      mutate('/api/conversations');
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
        <div className="flex justify-between items-center w-full">
          {editMode && (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex-1 flex items-center gap-2 -ml-2"
            >
              <input
                {...register('name')}
                autoFocus
                className="py-1 pr-1 pl-2 rounded-sm w-full focus:outline-none"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="py-2 focus:outline-none"
                aria-label="Save name"
              >
                <CheckIcon className="w-5 h-5" />
              </button>
            </form>
          )}

          {!editMode && (
            <>
              <Link
                onClick={onClickMobile}
                href={
                  conversation.agentId !== null
                    ? `/agents/${conversation.agentId}/c/${conversation.id}`
                    : `/c/${conversation.id}`
                }
                className="flex-1 truncate"
              >
                <span>{conversation.name}</span>
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
                  className={cw('shadow-sm rounded-md')}
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
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      handleDeleteConversation(conversation.id);
                    }}
                    className="text-destructive focus:text-destructive cursor-pointer"
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
