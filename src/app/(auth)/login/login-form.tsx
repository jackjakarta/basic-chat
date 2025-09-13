'use client';

import ContactForm from '@/components/common/contact-form';
import GithubIcon from '@/components/icons/github';
import GoogleIcon from '@/components/icons/google';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { emailSchema } from '@/utils/schemas';
import { cw, inputFieldErrorClassName, inputFieldErrorMessageClassName } from '@/utils/tailwind';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginFormSchema>;

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'form'>) {
  const router = useRouter();
  const t = useTranslations('auth.login.form');
  const tAuth = useTranslations('auth');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    setError,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
  });

  async function onSubmit(data: LoginFormData) {
    const { email: _email, password } = data;
    const email = _email.trim().toLowerCase();

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      const loginSuccess = result === undefined || result.ok;

      if (!loginSuccess) {
        setError('root', {
          type: 'manual',
          message: 'Wrong email or password',
        });
        return;
      }

      router.replace('/');
    } catch (error) {
      console.error({ error });
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

  const emailValue = watch('email');
  const passwordValue = watch('password');
  const buttonDisabled = !emailValue || !passwordValue || isSubmitting || isSubmitSuccessful;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cw('flex flex-col gap-6', className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="text-balance text-sm text-muted-foreground">{t('description')}</p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">{t('email.label')}</Label>
          <Input
            id="email"
            type="text"
            {...register('email')}
            placeholder="m@example.com"
            className={cw((errors.email || errors.root) && inputFieldErrorClassName)}
          />
          {errors.email && (
            <div className={inputFieldErrorMessageClassName}>{errors.email.message}</div>
          )}
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">{t('password.label')}</Label>
            <Link
              href="/reset-password"
              className="ml-auto text-xs text-muted-foreground hover:opacity-75"
            >
              {tAuth('forgot-password.message')}
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            {...register('password')}
            placeholder="********"
            className={cw((errors.password || errors.root) && inputFieldErrorClassName)}
          />
          {errors.password && (
            <div className={inputFieldErrorMessageClassName}>{errors.password.message}</div>
          )}
          {errors.root && (
            <div className={inputFieldErrorMessageClassName}>{errors.root.message}</div>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={buttonDisabled}>
          {isSubmitting || isSubmitSuccessful ? 'Logging in...' : 'Login'}
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">{t('or')}</span>
        </div>

        <div className="flex flex-col gap-4">
          <Button onClick={handleGoogleSignIn} type="button" variant="outline" className="w-full">
            <GoogleIcon />
            {t('login-with')} Google
          </Button>
          <Button onClick={handleGithubSignIn} type="button" variant="outline" className="w-full">
            <GithubIcon />
            {t('login-with')} GitHub
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-center gap-2 text-sm">
          <span className="text-muted-foreground">{tAuth('no-account')} </span>
          <Link href="/register" className="hover:opacity-75">
            {tAuth('register.sign-up')}
          </Link>
        </div>
        <ContactForm
          trigger={
            <div className="flex cursor-pointer items-center justify-center gap-2 text-sm">
              <span className="hover:opacity-75">Contact us</span>
            </div>
          }
        />
      </div>
    </form>
  );
}
