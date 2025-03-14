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

const registrationSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirm password is required'),
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
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(registrationSchema),
  });

  async function onSubmit(data: FormData) {
    try {
      console.debug({ data });
      toastSuccess('Account created successfully. Check your email.');
    } catch (error) {
      console.error({ error });
      toastError('An error occurred while creating your account');
    } finally {
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
              placeholder="Jane"
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
              placeholder="Doe"
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
          <div className="flex flex-row justify-end items-center gap-2">
            <Button type="button" variant="neutral">
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
