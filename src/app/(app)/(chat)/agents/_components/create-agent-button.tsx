'use client';

import DialogWindow from '@/components/common/modal';
import { useToast } from '@/components/hooks/use-toast';
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
import { cw, inputFieldErrorClassName, inputFieldErrorMessageClassName } from '@/utils/tailwind';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
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
  const { toastSuccess, toastLoading, toastError } = useToast();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  async function onSubmit(data: FormData) {
    toastLoading('Creating agent...');

    try {
      const newAgent = await createAgentAction({ ...data });
      setIsModalOpen(false);
      toastSuccess('Agent created successfully');
      router.push(`/agents/${newAgent.id}`);
    } catch (error) {
      console.error({ error });
      toastError('Failed to create agent');
    }
  }

  return (
    <div className="flex flex-col items-start gap-4">
      <Button className={className} onClick={() => setIsModalOpen(true)}>
        <span className="text-sm">Create Agent</span>
      </Button>

      <DialogWindow open={isModalOpen} onOpenChange={setIsModalOpen}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Create New Agent</CardTitle>
            <CardDescription>Fill in the details to create a new AI agent.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Agent Name</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Enter agent name"
                className={cw(errors.name && inputFieldErrorClassName)}
              />
              {errors.name && (
                <p className={inputFieldErrorMessageClassName}>{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="instructions">Instructions</Label>
              <Textarea
                id="instructions"
                {...register('instructions')}
                placeholder="Enter instructions for the agent"
                className={cw('min-h-[100px]', errors.name && inputFieldErrorClassName)}
              />
              {errors.instructions && (
                <p className={inputFieldErrorMessageClassName}>{errors.instructions.message}</p>
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
    </div>
  );
}
