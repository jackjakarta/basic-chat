'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { type AgentRow } from '@/db/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { updateAgentAction } from '../[agentId]/actions';

const editAgentSchema = z.object({
  name: z.string().optional(),
  instructions: z.string().optional(),
});

type FormData = z.infer<typeof editAgentSchema>;

export default function EditAgentForm({ agent }: { agent: AgentRow }) {
  const router = useRouter();

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
    toast.loading('Updating agent...');

    try {
      await updateAgentAction({ agentId: agent.id, data });
      toast.remove();
      toast.success('Agent updated');
    } catch (error) {
      console.error({ error });
      toast.remove();
      toast.error('Failed to update agent');
    } finally {
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register('name')} />
        {errors.name && <span className="text-red-500">{errors.name.message}</span>}
      </div>
      <div>
        <Label htmlFor="instructions">Instructions</Label>
        <Textarea rows={6} id="instructions" {...register('instructions')} />
        {errors.instructions && <span className="text-red-500">{errors.instructions.message}</span>}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        Update Agent
      </Button>
    </form>
  );
}
