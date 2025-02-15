'use client';

import { type TokenRow } from '@/db/schema';
import { emailSchema, passwordSchema } from '@/utils/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { updateUserPassword } from './actions';

type ResetPasswordFormProps = TokenRow;

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

export default function ResetPasswordForm({ email, token }: ResetPasswordFormProps) {
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
      // TODO: Send email with password reset confirmation

      router.push('/login');
    } catch (error) {
      console.error('Failed to reset password:', error);
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
          readOnly
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="password">New Password</label>
        <input
          id="password"
          type="password"
          placeholder="Enter your new password"
          {...register('password')}
          className={errors.password ? 'border-red-500' : 'border border-input'}
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="passwordConfirm">Confirm Password</label>
        <input
          id="passwordConfirm"
          type="password"
          placeholder="Confirm your new password"
          {...register('passwordConfirm')}
          className={errors.passwordConfirm ? 'border-red-500' : 'border border-input'}
        />
        {errors.passwordConfirm && (
          <p className="text-red-500 text-sm mt-1">{errors.passwordConfirm.message}</p>
        )}
      </div>

      <button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Resetting...' : 'Reset Password'}
      </button>
    </form>
  );
}
