'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cw, inputFieldErrorClassName, inputFieldErrorMessageClassName } from '@/utils/tailwind';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { verifyEmailCodeAction } from './actions';

const loginFormSchema = z.object({
  code: z.string().min(1, 'Code is required'),
});

type LoginFormData = z.infer<typeof loginFormSchema>;

type VerifyCodeFormProps = React.ComponentPropsWithoutRef<'form'> & { email: string };

export default function VerifyCodeForm({ email, className, ...props }: VerifyCodeFormProps) {
  const router = useRouter();

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
    const { code: _code } = data;
    const code = _code.trim().toUpperCase();
    const cleanedCode = sanitizeCode(code);

    try {
      await verifyEmailCodeAction({ token: cleanedCode });
      router.push('/');
    } catch (error) {
      console.error({ error });
      setError('code', {
        type: 'manual',
        message: 'Your code is invalid. Click resend to get a new code.',
      });
    }
  }

  async function handleResend() {
    try {
      console.debug({ email, message: 'Not implemented' });
    } catch (error) {
      console.error({ error });
    }
  }

  const codeValue = watch('code');
  const buttonDisabled = !codeValue || isSubmitting || isSubmitSuccessful;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cw('flex flex-col gap-6', className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Verify email</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Verify your email address by entering the code we sent to your email.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="code">Code</Label>
            <button
              id="code"
              type="button"
              onClick={handleResend}
              className="ml-auto text-xs underline-offset-4 hover:underline"
            >
              Resend code
            </button>
          </div>
          <Input
            id="code"
            type="text"
            {...register('code')}
            placeholder="ADS D7A"
            className={cw(errors.code && inputFieldErrorClassName)}
          />
          {errors.code && (
            <div className={inputFieldErrorMessageClassName}>{errors.code.message}</div>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={buttonDisabled}>
          {isSubmitting || isSubmitSuccessful ? 'Verifying code...' : 'Verify'}
        </Button>
      </div>
      <div className="flex justify-center items-center gap-2 text-sm">
        Alredy have an account?{' '}
        <Link href="/login" className="underline underline-offset-4">
          Login
        </Link>
      </div>
    </form>
  );
}

function sanitizeCode(input: string): string {
  return input.replace(/\s+/g, '').toUpperCase();
}
