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
import { cw, inputFieldErrorClassName, inputFieldErrorMessageClassName } from '@/utils/tailwind';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { createAssistantAction } from '../actions';
import { newAssistantSchema } from '../schemas';

type FormData = z.infer<typeof newAssistantSchema>;

export default function CreateAssistantButton({ className }: { className?: string }) {
  const t = useTranslations('assistants');
  const tCommon = useTranslations('common');

  const router = useRouter();
  const { toastSuccess, toastLoading, toastError } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(newAssistantSchema),
  });

  async function onSubmit(data: FormData) {
    toastLoading(t('toasts.toast-create-loading'));

    try {
      const newAssistant = await createAssistantAction(data);
      toastSuccess(t('toasts.toast-create-success'));
      router.push(`/assistants/${newAssistant.id}`);
    } catch (error) {
      console.error({ error });
      toastError(t('toasts.toast-create-error'));
    }
  }

  const nameValue = watch('name');

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" className={cw('text-sm', className)}>
          {t('buttons.create-assistant')}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <DialogHeader className="flex flex-col gap-1">
            <DialogTitle>{t('buttons.create-assistant')}</DialogTitle>
            <DialogDescription>{t('create.description')}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Label htmlFor="name">{t('create.form.name.label')}</Label>
            <Input
              id="name"
              placeholder={t('create.form.name.placeholder')}
              className={cw(errors.name && inputFieldErrorClassName)}
              {...register('name')}
            />
            {errors.name && (
              <span className={inputFieldErrorMessageClassName}>{errors.name.message}</span>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{tCommon('cancel')}</Button>
            </DialogClose>
            <Button type="submit" className="w-fit" disabled={isSubmitting || nameValue === ''}>
              {t('buttons.create-assistant')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
