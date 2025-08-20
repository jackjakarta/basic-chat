'use client';

import { useToast } from '@/components/hooks/use-toast';
import GithubIcon from '@/components/icons/github';
import GoogleIcon from '@/components/icons/google';
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

  async function handleGithubSignIn() {
    try {
      await signIn('github');
    } catch (error) {
      console.error({ error });
    }
  }

  async function handleGoogleSignIn() {
    try {
      await signIn('google');
    } catch (error) {
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
        <div className="flex flex-col gap-4">
          <Button onClick={handleGoogleSignIn} type="button" variant="outline" className="w-full">
            <GoogleIcon />
            Sign up with Google
          </Button>
          <Button onClick={handleGithubSignIn} type="button" variant="outline" className="w-full">
            <GithubIcon />
            Sign up with GitHub
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 text-sm">
        <span className="text-muted-foreground">Alredy have an account?</span>
        <Link href="/login" className="hover:text-muted-foreground">
          Login
        </Link>
      </div>
    </form>
  );
}
