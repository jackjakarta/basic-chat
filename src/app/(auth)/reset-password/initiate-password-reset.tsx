'use client';

import { emailSchema } from '@/utils/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { getUserByEmail } from './actions';

const schema = z.object({
  email: emailSchema,
});

type FormData = z.infer<typeof schema>;

export default function InitiatePasswordResetForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const router = useRouter();

  async function onSubmit(data: FormData) {
    const { email } = data;
    const user = await getUserByEmail({ email });
    const successMessage = `If an account with email '${email}' exists, a password reset link has been sent`;

    if (user === undefined) {
      console.error(`User with email '${email}' not found`);
      toast.success(successMessage);
      router.push('/login');
      return;
    }

    try {
      // TODO: Send email with reset password link
      toast.success(successMessage);
      router.push('/login');
    } catch (error) {
      console.error(error);
      toast.error('Failed to send password reset email');
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col bg-white w-full max-w-[500px] p-8 border border-gray-300 rounded-md shadow-md space-y-6 mx-auto"
    >
      <div className="space-y-2">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          {...register('email')}
          className={errors.email ? 'border-red-500' : 'border border-input'}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>

      <button type="submit" className="w-full">
        Submit
      </button>
    </form>
  );
}
