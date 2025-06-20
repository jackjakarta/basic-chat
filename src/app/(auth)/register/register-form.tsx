'use client';

import { useToast } from '@/components/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { emailSchema, firstNameSchema, lastNameSchema, passwordSchema } from '@/utils/schemas';
import { cw, inputFieldErrorClassName, inputFieldErrorMessageClassName } from '@/utils/tailwind';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { registerNewUserAction } from './actions';

const registrationSchema = z
  .object({
    firstName: firstNameSchema,
    lastName: lastNameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegistrationFormData = z.infer<typeof registrationSchema>;

type RegistrationProps = React.ComponentPropsWithoutRef<'form'>;

export default function RegisterForm({ className, ...props }: RegistrationProps) {
  const router = useRouter();
  const { toastSuccess, toastError } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  async function onSubmit(data: RegistrationFormData) {
    const { firstName, lastName, email: _email, password } = data;
    const email = _email.trim().toLowerCase();

    try {
      const newUser = await registerNewUserAction({
        firstName,
        lastName,
        email,
        password,
        authProvider: 'credentials',
      });

      const result = await signIn('credentials', {
        email: newUser.email,
        password: data.password,
        redirect: false,
      });

      const loginSuccess = result === undefined || result.ok;

      if (loginSuccess) {
        router.push('/');
      }

      toastSuccess('Account created successfully. Check your email.');
    } catch (error) {
      console.error({ error });
      toastError('An error occurred while creating your account');
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cw('flex flex-col gap-6', className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Register</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your information below to create an account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            type="text"
            {...register('firstName')}
            placeholder="Jane"
            className={cw(errors.firstName && inputFieldErrorClassName)}
          />
          {errors.firstName && (
            <span className={inputFieldErrorMessageClassName}>{errors.firstName.message}</span>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            type="text"
            {...register('lastName')}
            placeholder="Doe"
            className={cw(errors.lastName && inputFieldErrorClassName)}
          />
          {errors.lastName && (
            <span className={inputFieldErrorMessageClassName}>{errors.lastName.message}</span>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="text"
            {...register('email')}
            placeholder="m@example.com"
            className={cw(errors.email && inputFieldErrorClassName)}
          />
          {errors.email && (
            <span className={inputFieldErrorMessageClassName}>{errors.email.message}</span>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="********"
            {...register('password')}
            className={cw(errors.password && inputFieldErrorClassName)}
          />
          {errors.password && (
            <span className={inputFieldErrorMessageClassName}>{errors.password.message}</span>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Password confirmation</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="********"
            {...register('confirmPassword')}
            className={cw(errors.password && inputFieldErrorClassName)}
          />
          {errors.confirmPassword && (
            <span className={inputFieldErrorMessageClassName}>
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting || isSubmitSuccessful} className="w-full">
          {isSubmitting || isSubmitSuccessful ? 'Loading...' : 'Register'}
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
        <Button
          type="button"
          variant="outline"
          className="w-full disabled:cursor-not-allowed"
          disabled
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
              fill="currentColor"
            />
          </svg>
          Continue with GitHub
        </Button>
      </div>
      <div className="flex justify-center items-center gap-2 text-sm">
        <span className="text-muted-foreground">Alredy have an account?</span>
        <Link href="/login" className="hover:text-muted-foreground">
          Login
        </Link>
      </div>
    </form>
  );
}
