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
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { createAgentAction } from '../actions';

export const newAgentSchema = z.object({
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

  const t = useTranslations('agents');
  const router = useRouter();
  const { toastSuccess, toastLoading, toastError } = useToast();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  async function onSubmit(data: FormData) {
    toastLoading(t('toasts.toast-create-loading'));

    try {
      const newAgent = await createAgentAction({ ...data });
      setIsModalOpen(false);
      toastSuccess(t('toasts.toast-create-success'));
      router.push(`/agents/${newAgent.id}`);
    } catch (error) {
      console.error({ error });
      toastError(t('toasts.toast-create-error'));
    }
  }

  return (
    <div className="flex flex-col items-start gap-4">
      <Button className={className} onClick={() => setIsModalOpen(true)}>
        <span className="text-sm">{t('buttons.create-agent')}</span>
      </Button>

      <DialogWindow open={isModalOpen} onOpenChange={setIsModalOpen}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>{t('create.title')}</CardTitle>
            <CardDescription>{t('create.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('create.form.name.label')}</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder={t('create.form.name.placeholder')}
                className={cw(errors.name && inputFieldErrorClassName)}
              />
              {errors.name && (
                <p className={inputFieldErrorMessageClassName}>{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="instructions">{t('create.form.instructions.label')}</Label>
              <Textarea
                id="instructions"
                {...register('instructions')}
                placeholder={t('create.form.instructions.placeholder')}
                className={cw('min-h-[100px]', errors.name && inputFieldErrorClassName)}
              />
              {errors.instructions && (
                <p className={inputFieldErrorMessageClassName}>{errors.instructions.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? t('buttons.creating-agent') : t('buttons.create-agent')}
            </Button>
          </CardFooter>
        </form>
      </DialogWindow>
    </div>
  );
}
