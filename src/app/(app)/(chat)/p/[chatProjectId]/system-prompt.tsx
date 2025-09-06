'use client';

import { useToast } from '@/components/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { updateChatProjectSystemPromptAction } from './actions';

const renameSchema = z.object({
  systemPrompt: z.string().min(0).max(2000),
});

type SystemPromptDialogProps = {
  chatProjectId: string;
  currentSystemPrompt: string | null;
};

type RenameFormData = z.infer<typeof renameSchema>;

export default function SystemPromptDialog({
  chatProjectId,
  currentSystemPrompt,
}: SystemPromptDialogProps) {
  const router = useRouter();
  const { toastSuccess, toastError } = useToast();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = useForm<RenameFormData>({
    resolver: zodResolver(renameSchema),
    defaultValues: {
      systemPrompt: currentSystemPrompt ?? '',
    },
  });

  async function onSubmit(data: RenameFormData) {
    if (isSubmitting || !isDirty) {
      return;
    }

    const { systemPrompt: _systemPrompt } = data;
    const systemPrompt = _systemPrompt.trim();
    const systemPromptOrNull = systemPrompt.length > 0 ? systemPrompt : null;

    try {
      await updateChatProjectSystemPromptAction({
        chatProjectId,
        systemPrompt: systemPromptOrNull,
      });
      toastSuccess('System prompt updated successfully');
    } catch (error) {
      console.error('Error updating system prompt:', error);
      toastError('There was an error updating the system prompt');
    } finally {
      router.refresh();
    }
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <h2 className="mb-2 text-xl font-semibold">System Prompt</h2>
      <form onBlur={handleSubmit(onSubmit)}>
        <Textarea
          placeholder='E.g., "I am working on my bachelor thesis."'
          className="h-[150px] w-full rounded-lg border border-border bg-popover/60 p-4 shadow-lg"
          {...register('systemPrompt')}
        />
      </form>
    </div>
  );
}
