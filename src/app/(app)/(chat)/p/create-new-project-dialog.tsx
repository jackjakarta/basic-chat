'use client';

import { useToast } from '@/components/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { allowedIconsSchema, iconColorSchema } from '@/utils/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { createChatProjectAction } from './actions';

type CreateNewProjectDialogProps = {
  trigger?: React.ReactNode;
};

const renameSchema = z.object({
  name: z.string().min(1),
});

type RenameFormData = z.infer<typeof renameSchema>;

export default function CreateNewProjectDialog({ trigger }: CreateNewProjectDialogProps) {
  const router = useRouter();
  const { toastError } = useToast();

  const [open, setOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<RenameFormData>({
    resolver: zodResolver(renameSchema),
    defaultValues: {
      name: '',
    },
  });

  async function onSubmit(data: RenameFormData) {
    const { name: _name } = data;
    const name = _name.trim();

    try {
      const chatProject = await createChatProjectAction({
        name,
        icon: allowedIconsSchema.options[0],
        iconColor: iconColorSchema.options[2],
      });

      reset();
      setOpen(false);

      router.push(`/p/${chatProject.id}`);
    } catch (error) {
      console.error('Error creating new project:', error);
      toastError('Failed to create new project. Please try again.');
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" className="w-fit">
            Create New Project
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new project</DialogTitle>
          <DialogDescription>Create a new project to organize your conversations</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register('name')} />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting} aria-disabled={isSubmitting}>
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
