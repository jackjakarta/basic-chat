'use client';

import { toastError, toastSuccess } from '@/components/common/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { emailSchema } from '@/utils/schemas';
import { cw } from '@/utils/tailwind';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { getUserByEmail, sendPasswordResetEmail } from './actions';

const schema = z.object({
  email: emailSchema,
});

type FormData = z.infer<typeof schema>;

type InitiatePasswordResetFormProps = React.ComponentPropsWithoutRef<'form'>;

export default function InitiatePasswordResetForm({
  className,
  ...props
}: InitiatePasswordResetFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    const { email } = data;
    const successMessage = `An email has been sent to '${email}'`;

    const user = await getUserByEmail({ email });

    if (user.email === undefined) {
      toastSuccess(successMessage);
      console.error('User not found');
      router.push('/login');
      return;
    }

    try {
      const emailResult = await sendPasswordResetEmail({ email });

      if (!emailResult.success) {
        console.error({ emailResult });
        toastError('Failed to send password reset email');
        return;
      }

      toastSuccess(successMessage);
      router.push('/login');
    } catch (error) {
      toastError('Failed to send password reset email');

      if (error instanceof Error) {
        console.error({ errorMessage: error.message });
        return;
      }

      console.error({ error });
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cw('flex flex-col gap-6', className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Reset your password</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to get a password reset link
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="text"
            {...register('email')}
            placeholder="m@example.com"
            className={cw(errors.email && 'border-red-500')}
          />
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Sending email...' : 'Send email'}
        </Button>
      </div>
      <div className="text-center text-sm">
        <Link href="/login" className="underline underline-offset-4">
          Back to login
        </Link>
      </div>
    </form>
  );
}
