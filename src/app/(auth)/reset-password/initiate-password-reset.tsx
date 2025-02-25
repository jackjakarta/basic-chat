'use client';

import { toastError, toastSuccess } from '@/components/common/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { emailSchema } from '@/utils/schemas';
import { cw } from '@/utils/tailwind';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { getUserByEmail, sendPasswordResetEmail } from './actions';

const schema = z.object({
  email: emailSchema,
});

type FormData = z.infer<typeof schema>;

export default function InitiatePasswordResetForm() {
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
      className="flex flex-col bg-sidebar-accent w-full max-w-xl p-8 rounded-md shadow-md space-y-6 mx-auto"
    >
      <div className="space-y-2">
        <Label htmlFor="email" className="text-primary-foreground">
          Email
        </Label>
        <Input
          id="email"
          type="text"
          placeholder="bob@email.com"
          {...register('email')}
          className={cw(
            'bg-gray-100 text-secondary-foreground placeholder:text-gray-300',
            errors.email ? 'border-red-500' : 'border border-input',
          )}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>

      <Button disabled={isSubmitting} type="submit" className="w-full">
        Submit
      </Button>
    </form>
  );
}
