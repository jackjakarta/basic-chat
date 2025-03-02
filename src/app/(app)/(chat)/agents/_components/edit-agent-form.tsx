'use client';

import { useToast } from '@/components/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { type AgentRow } from '@/db/schema';
import { cw, inputFieldErrorClassName, inputFieldErrorMessageClassName } from '@/utils/tailwind';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { updateAgentAction } from '../[agentId]/actions';

const editAgentSchema = z.object({
  name: z.string().optional(),
  instructions: z.string().optional(),
});

type FormData = z.infer<typeof editAgentSchema>;

export default function EditAgentForm({ agent }: { agent: AgentRow }) {
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          {...register('name')}
          className={cw(errors.name && inputFieldErrorClassName)}
        />
        {errors.name && (
          <span className={inputFieldErrorMessageClassName}>{errors.name.message}</span>
        )}
      </div>
      <div>
        <Label htmlFor="instructions">Instructions</Label>
        <Textarea
          rows={6}
          id="instructions"
          {...register('instructions')}
          className={cw(errors.name && inputFieldErrorClassName)}
        />
        {errors.instructions && (
          <span className={inputFieldErrorMessageClassName}>{errors.instructions.message}</span>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        Update Agent
      </Button>
    </form>
  );
}
