'use client';

import { emailSchema } from '@/utils/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginFormSchema>;

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
  });
  const router = useRouter();

  async function onSubmit(data: LoginFormData) {
    const { email: _email, password } = data;
    const email = _email.trim().toLowerCase();
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    const loginSuccess = result === undefined || result.ok;

    if (loginSuccess) {
      router.refresh();
    } else {
      setError('password', {
        type: 'manual',
        message: 'Wrong email or password',
      });
    }
  }

  return (
    <main className="w-full flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 max-w-[750px] flex flex-col items-start justify-center shadow-lg w-full sm:w-5/6 md:w-3/4 lg:w-1/2 bg-white rounded-lg">
        <h1 className="text-2xl font-bold text-gray-900">Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="text"
              {...register('email')}
              className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register('password')}
              className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="flex justify-between items-center">
              <Link href="/reset-password" className="text-sm text-indigo-600 hover:underline mt-2">
                Forgot password ?
              </Link>
              <Link href="/register" className="text-sm text-indigo-600 hover:underline mt-2">
                Sign up
              </Link>
            </div>
            {errors.password && (
              <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>
          <div className="flex gap-3 justify-center mt-2 items-center">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
