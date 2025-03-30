'use client';

import { useToast } from '@/components/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cw, inputFieldErrorClassName, inputFieldErrorMessageClassName } from '@/utils/tailwind';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { createAgentAction } from './actions';
import { newAgentSchema } from './schemas';

type FormData = z.infer<typeof newAgentSchema>;

export default function CreateAgentForm() {
  const t = useTranslations('agents');
  const router = useRouter();
  const { toastSuccess, toastLoading, toastError } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(newAgentSchema),
  });

  async function onSubmit(data: FormData) {
    toastLoading(t('toasts.toast-create-loading'));

    try {
      const newAgent = await createAgentAction(data);
      toastSuccess(t('toasts.toast-create-success'));
      router.push(`/agents/${newAgent.id}`);
    } catch (error) {
      console.error({ error });
      toastError(t('toasts.toast-create-error'));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">{t('create.form.name.label')}</Label>
        <Input
          id="name"
          placeholder={t('create.form.name.placeholder')}
          {...register('name')}
          className={cw(errors.name && inputFieldErrorClassName)}
        />
        {errors.name && (
          <span className={inputFieldErrorMessageClassName}>{errors.name.message}</span>
        )}
      </div>
      <div>
        <Label htmlFor="instructions">{t('create.form.instructions.label')}</Label>
        <Textarea
          rows={6}
          id="instructions"
          placeholder={t('create.form.instructions.placeholder')}
          {...register('instructions')}
          className={cw(errors.name && inputFieldErrorClassName)}
        />
        {errors.instructions && (
          <span className={inputFieldErrorMessageClassName}>{errors.instructions.message}</span>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {t('buttons.create-agent')}
      </Button>
    </form>
  );
}
