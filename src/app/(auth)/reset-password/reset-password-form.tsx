'use client';

import { useToast } from '@/components/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type TokenRow } from '@/db/schema';
import { emailSchema, passwordSchema } from '@/utils/schemas';
import { cw } from '@/utils/tailwind';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { updateUserPassword } from './actions';

type ResetPasswordFormProps = React.ComponentPropsWithoutRef<'form'> & TokenRow;

const resetPasswordSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    passwordConfirm: passwordSchema,
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'The passwords do not match',
    path: ['passwordConfirm'],
  });

type FormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordForm({
  email,
  token,
  className,
  ...props
}: ResetPasswordFormProps) {
  const { toastSuccess, toastError } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: email ?? undefined },
  });

  const router = useRouter();

  async function onSubmit(data: FormData) {
    try {
      const { email: _email, password } = data;
      const email = _email.trim().toLowerCase();

      await updateUserPassword({ email, password, token });
      toastSuccess('Password updated successfully');
      router.push('/login');
    } catch (error) {
      console.error({ error });
      toastError('Failed to reset password');
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cw('flex flex-col gap-6', className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create a new password</h1>
        <p className="text-balance text-sm text-muted-foreground">Update your password below</p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            readOnly
            id="email"
            type="text"
            {...register('email')}
            className={cw('bg-secondary/30', errors.email && 'border-red-500')}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            {...register('password')}
            placeholder="********"
            className={cw(errors.password && 'border-red-500')}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="passwordConfirm">Confirm password</Label>
          <Input
            id="passwordConfirm"
            type="password"
            {...register('passwordConfirm')}
            placeholder="********"
            className={cw(errors.passwordConfirm && 'border-red-500')}
          />
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Updating...' : 'Reset password'}
        </Button>
      </div>
      <div className="text-center text-muted-foreground text-sm">
        Make sure to use a strong password that you don't use elsewhere to keep your account secure
      </div>
    </form>
  );
}
