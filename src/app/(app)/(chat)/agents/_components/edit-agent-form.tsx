'use client';

import { useToast } from '@/components/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { type AgentRow, type VectorFile } from '@/db/schema';
import { cw, inputFieldErrorClassName, inputFieldErrorMessageClassName } from '@/utils/tailwind';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { updateAgentAction } from '../[agentId]/actions';
import AgentKnowledgeDisplay from './agent-knowledge-files';

const editAgentSchema = z.object({
  name: z.string().optional(),
  instructions: z.string().optional(),
});

type FormData = z.infer<typeof editAgentSchema>;

export default function EditAgentForm({
  agent,
  agentFiles,
}: {
  agent: AgentRow;
  agentFiles?: VectorFile[] | null;
}) {
  const router = useRouter();
  const { toastSuccess, toastLoading, toastError } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(editAgentSchema),
    defaultValues: {
      name: agent.name,
      instructions: agent.instructions ?? undefined,
    },
  });

  async function onSubmit(data: FormData) {
    toastLoading('Updating agent...');

    try {
      await updateAgentAction({ agentId: agent.id, data });
      toastSuccess('Agent updated successfully');
    } catch (error) {
      console.error({ error });
      toastError('Failed to update agent');
    } finally {
      router.refresh();
    }
  }

  return (
    <div className="flex flex-col w-full mx-auto py-8 px-4">
      <Card className="border-border/40 shadow-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Update Agent</CardTitle>
          <CardDescription>Customize your agent's details and behavior</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-row gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Name
                </Label>
                <Input
                  id="name"
                  {...register('name')}
                  className={cw(
                    'resize-none transition-colors',
                    errors.name ? inputFieldErrorClassName : 'border-input',
                  )}
                  placeholder="Enter agent name"
                />
                {errors.name && (
                  <p className={inputFieldErrorMessageClassName}>{errors.name.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions" className="text-sm font-medium">
                Instructions
              </Label>
              <Textarea
                rows={6}
                id="instructions"
                {...register('instructions')}
                className={cw(
                  'resize-none transition-colors',
                  errors.instructions ? inputFieldErrorClassName : 'border-input',
                )}
                placeholder="Provide detailed instructions for your agent..."
              />
              {errors.instructions && (
                <p className={inputFieldErrorMessageClassName}>{errors.instructions.message}</p>
              )}
            </div>
            <AgentKnowledgeDisplay vectorStoreId={agent.vectorStoreId} files={agentFiles ?? []} />
            <Button type="submit" disabled={isSubmitting} className="w-full mt-6 transition-all">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating agent...
                </>
              ) : (
                'Update Agent'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
