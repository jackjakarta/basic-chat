'use client';

import { useToast } from '@/components/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { firstNameSchema, lastNameSchema } from '@/utils/schemas';
import { cw, inputFieldErrorClassName, inputFieldErrorMessageClassName } from '@/utils/tailwind';
import { ObscuredUser } from '@/utils/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const inputFieldClassName =
  'dark:border-muted/50 dark:hover:border-muted dark:focus:border-transparent dark:focus-visible:ring-muted';

const registrationSchema = z.object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  customInstructions: z.string().optional(),
});

type FormData = z.infer<typeof registrationSchema>;

type RegistrationProps = {
  className?: React.ComponentProps<'form'>['className'];
  customInstructions?: string;
} & ObscuredUser;

export default function ProfileForm({
  firstName,
  lastName,
  customInstructions,
  className,
  ...props
}: RegistrationProps) {
  const router = useRouter();
  const tCommon = useTranslations('common');

  const { toastSuccess, toastError } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      firstName,
      lastName,
      customInstructions: customInstructions ?? '',
    },
  });

  async function onSubmit(data: FormData) {
    try {
      console.debug({ data });
      toastSuccess('Account created successfully. Check your email.');
    } catch (error) {
      console.error({ error });
      toastError('An error occurred while creating your account');
    } finally {
      router.refresh();
    }
  }

  const firstNameValue = watch('firstName');
  const lastNameValue = watch('lastName');
  const customInstructionsValue = watch('customInstructions');

  const showButton =
    firstNameValue !== firstName ||
    lastNameValue !== lastName ||
    customInstructionsValue !== (customInstructions ?? '');

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cw('flex flex-col gap-6', className)}
      {...props}
    >
      <div className="grid gap-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-4">
            <Label htmlFor="firstName">{tCommon('first-name')}</Label>
            <Input
              id="firstName"
              type="text"
              {...register('firstName')}
              placeholder="Jane"
              disabled={isSubmitting}
              className={cw(inputFieldClassName, errors.firstName && inputFieldErrorClassName)}
            />
            {errors.firstName && (
              <span className={inputFieldErrorMessageClassName}>{errors.firstName.message}</span>
            )}
          </div>

          <div className="grid gap-4">
            <Label htmlFor="lastName">{tCommon('last-name')}</Label>
            <Input
              id="lastName"
              type="text"
              {...register('lastName')}
              placeholder="Doe"
              disabled={isSubmitting}
              className={cw(inputFieldClassName, errors.lastName && inputFieldErrorClassName)}
            />
            {errors.lastName && (
              <span className={inputFieldErrorMessageClassName}>{errors.lastName.message}</span>
            )}
          </div>
        </div>
        <div className="grid gap-4">
          <Label htmlFor="instructions">
            What preferences should the chat consider in responses?
          </Label>
          <Textarea
            id="instructions"
            rows={8}
            style={{ resize: 'none' }}
            {...register('customInstructions')}
            placeholder="eg. I primarily use this chat for coding questions, so please keep responses concise and to the point."
            disabled={isSubmitting}
            className={cw(
              inputFieldClassName,
              errors.customInstructions && inputFieldErrorClassName,
            )}
          />
          {errors.customInstructions && (
            <span className={inputFieldErrorMessageClassName}>
              {errors.customInstructions.message}
            </span>
          )}
        </div>

        <div
          className={cw(
            'overflow-hidden transition-all duration-500 ease-in-out',
            showButton ? 'max-h-[100px]' : 'max-h-0',
          )}
        >
          <div className="flex flex-row justify-end items-center gap-2">
            <Button type="button" variant="neutral">
              {tCommon('cancel')}
            </Button>
            <Button type="submit" variant="secondary" disabled={isSubmitting}>
              {isSubmitting ? tCommon('loading') : tCommon('save-changes')}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
