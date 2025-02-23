'use client';

import DialogWindow from '@/components/common/modal';
import { Button } from '@/components/ui/button';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { createAgentAction } from '../actions';

const newAgentSchema = z.object({
  name: z.string().min(1, 'Agent name is required'),
  instructions: z.string().min(1, 'Instructions are required'),
});

type FormData = z.infer<typeof newAgentSchema>;

type CreateAgentButtonProps = {
  className?: React.ComponentProps<'button'>['className'];
};

export default function CreateAgentButton({ className }: CreateAgentButtonProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(newAgentSchema),
  });

  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  async function onSubmit(data: FormData) {
    toast.loading('Creating agent...');

    try {
      const newAgent = await createAgentAction({ ...data });
      setIsModalOpen(false);
      toast.remove();
      toast.success('Agent created successfully');
      router.push(`/agents/${newAgent?.id}`);
    } catch (error) {
      console.error({ error });
      toast.remove();
      toast.error('Failed to create agent');
    }
  }

  return (
    <>
      <button onClick={() => setIsModalOpen(true)} className={className}>
        <div className="flex items-center gap-2">
          <span className="text-sm">Create Agent</span>
        </div>
      </button>

      <DialogWindow open={isModalOpen} onOpenChange={setIsModalOpen}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Create New Agent</CardTitle>
            <CardDescription>Fill in the details to create a new AI agent.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Agent Name</Label>
              <Input id="name" {...register('name')} placeholder="Enter agent name" />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="instructions">Instructions</Label>
              <Textarea
                id="instructions"
                {...register('instructions')}
                placeholder="Enter instructions for the agent"
                className="min-h-[100px]"
              />
              {errors.instructions && (
                <p className="text-sm text-red-500">{errors.instructions.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Agent'}
            </Button>
          </CardFooter>
        </form>
      </DialogWindow>
    </>
  );
}
