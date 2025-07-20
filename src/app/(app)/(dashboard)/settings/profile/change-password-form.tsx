'use client';

import { useToast } from '@/components/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { passwordSchema } from '@/utils/schemas';
import {
  cw,
  inputFieldClassName,
  inputFieldErrorClassName,
  inputFieldErrorMessageClassName,
} from '@/utils/tailwind';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { updateUserPasswordAction } from './actions';

const registrationSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
  });

type FormData = z.infer<typeof registrationSchema>;

type RegistrationProps = React.ComponentPropsWithoutRef<'form'>;

export default function ChangePasswordForm({ className, ...props }: RegistrationProps) {
  const router = useRouter();
  const tCommon = useTranslations('common');

  const { toastSuccess, toastError } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(registrationSchema),
  });

  async function onSubmit(data: FormData) {
    try {
      const { newPassword } = data;
      await updateUserPasswordAction({ newPassword });
      toastSuccess('Passwort changed successfully');
    } catch (error) {
      console.error({ error });
      toastError('An error occurred while changing your password');
    } finally {
      reset();
      router.refresh();
    }
  }

  const watchNewPassword = watch('newPassword');
  const watchConfirmPassword = watch('confirmPassword');

  const showButton = watchNewPassword && watchConfirmPassword;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cw('flex flex-col gap-6', className)}
      {...props}
    >
      <div className="grid gap-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-4">
            <Label htmlFor="firstName">{tCommon('new-password')}</Label>
            <Input
              id="firstName"
              type="password"
              {...register('newPassword')}
              placeholder="Your new passowrd"
              className={cw(inputFieldClassName, errors.newPassword && inputFieldErrorClassName)}
            />
            {errors.newPassword && (
              <span className={inputFieldErrorMessageClassName}>{errors.newPassword.message}</span>
            )}
          </div>

          <div className="grid gap-4">
            <Label htmlFor="lastName">{tCommon('password')}</Label>
            <Input
              id="lastName"
              type="password"
              {...register('confirmPassword')}
              placeholder="Confirm your password"
              className={cw(
                inputFieldClassName,
                errors.confirmPassword && inputFieldErrorClassName,
              )}
            />
            {errors.confirmPassword && (
              <span className={inputFieldErrorMessageClassName}>
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
        </div>

        <div
          className={cw(
            'overflow-hidden transition-all duration-500 ease-in-out',
            showButton ? 'max-h-[100px]' : 'max-h-0',
          )}
        >
          <div className="flex flex-row items-center justify-end gap-2">
            <Button onClick={() => reset()} type="button" variant="neutral">
              {tCommon('cancel')}
            </Button>
            <Button type="submit" variant="secondary" disabled={isSubmitting}>
              {isSubmitting ? tCommon('loading') : tCommon('save-changes')}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
