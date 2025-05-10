'use client';

import AlertModal from '@/components/common/alert-modal';
import { useToast } from '@/components/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import { deleteAllConversationsAction } from './actions';

export default function DeleteAllChatsButton() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastError, toastLoading } = useToast();
  const [isOpen, setIsOpen] = React.useState(false);

  async function handleDeleteAllConversations() {
    toastLoading('Deleting conversations...');

    try {
      await deleteAllConversationsAction();
      toastSuccess('Chats deleted successfully');
    } catch (error) {
      console.error('Error deleting conversations:', error);
      toastError('Failed to delete chats');
    } finally {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      setIsOpen(false);
    }
  }

  return (
    <>
      <Button variant="destructive" className="w-full" onClick={() => setIsOpen(true)}>
        Delete all chats
      </Button>

      <AlertModal
        title="Delete all conversations"
        description="Are you sure you want to delete all conversations? This action cannot be undone."
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onConfirm={handleDeleteAllConversations}
        type="destructive"
      />
    </>
  );
}
