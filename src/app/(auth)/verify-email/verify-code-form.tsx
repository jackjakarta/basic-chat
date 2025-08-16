'use client';

import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { cw, inputFieldErrorMessageClassName } from '@/utils/tailwind';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Sentry from '@sentry/nextjs';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { verifyEmailCodeAction } from './actions';

const loginFormSchema = z.object({
  code: z.string().min(1, 'Code is required'),
});

type LoginFormData = z.infer<typeof loginFormSchema>;

type VerifyCodeFormProps = React.ComponentPropsWithoutRef<'form'> & { email: string };

export default function VerifyCodeForm({ email, className, ...props }: VerifyCodeFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    setError,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
  });

  async function onSubmit(data: LoginFormData) {
    const { code: _code } = data;
    const code = sanitizeCode(_code);

    try {
      await verifyEmailCodeAction({ code });
      window.location.reload();
    } catch (error) {
      Sentry.captureException(error);
      setError('code', {
        type: 'manual',
        message: 'Your code is invalid. Click resend to get a new code.',
      });
    }
  }

  async function handleResend() {
    try {
      console.info({ email, message: 'Not implemented' });
    } catch (error) {
      Sentry.captureException(error);
    }
  }

  const codeValue = watch('code');
  const buttonDisabled = !codeValue || isSubmitting || isSubmitSuccessful;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cw('flex flex-col gap-4', className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-2xl font-bold">Verify email</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Verify your email address by entering the code we sent to your email.
        </p>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Controller
            control={control}
            name="code"
            render={({ field: { onChange, value } }) => (
              <InputOTP maxLength={6} value={value} onChange={onChange}>
                <InputOTPGroup className="p-4">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup className="p-4">
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            )}
          />
          {errors.code && (
            <div className={inputFieldErrorMessageClassName}>{errors.code.message}</div>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={buttonDisabled}>
          {isSubmitting || isSubmitSuccessful ? 'Verifying code...' : 'Verify'}
        </Button>
      </div>
      <div className="flex items-center justify-center gap-2 text-sm">
        <span className="text-muted-foreground">Haven't recieved a code?</span>
        <button onClick={handleResend} className="hover:text-muted-foreground">
          Resend
        </button>
      </div>
    </form>
  );
}

function sanitizeCode(input: string): string {
  const trimmed = input.trim();
  const sanitized = trimmed.replace(/\s+/g, '').toUpperCase();

  return sanitized;
}
