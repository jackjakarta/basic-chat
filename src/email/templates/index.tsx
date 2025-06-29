import { dbInsertOrUpdateActionToken } from '@/db/functions/token';
import { dbGetUserByEmail } from '@/db/functions/user';
import { type TokenAction } from '@/db/schema';
import ForgotPasswordTemplate from '@/emails/forgot-password';
import VerifyEmailTemplate from '@/emails/verify-email';
import { getBaseUrlByHeaders } from '@/utils/host';
import { buildUserActionUrl } from '@/utils/url';
import { render } from '@react-email/components';

import { type InformationEmailMetadata, type MailTemplateResponse } from '../types';
import { buildInformationEmailTemplate } from './information-template';

export async function createUserActionMailTemplate(
  email: string,
  action: TokenAction,
): Promise<MailTemplateResponse | undefined> {
  if (action === 'reset-password' && (await dbGetUserByEmail({ email })) === undefined) {
    console.error({ error: `Cannot send email to non-existing user with email '${email}'` });
    return undefined;
  }

  const userActionRow = await dbInsertOrUpdateActionToken({ email, action });

  if (userActionRow === undefined) {
    console.error({ error: `Failed to retrieve or create action token for email '${email}'` });
    return undefined;
  }

  const searchParams = new URLSearchParams({
    token: userActionRow.token,
  });

  const actionUrl = buildUserActionUrl({ searchParams, tokenAction: action });
  const baseUrl = getBaseUrlByHeaders();

  switch (action) {
    case 'verify-email':
      return {
        success: true,
        subject: 'Verify your email address',
        mailTemplate: await render(
          <VerifyEmailTemplate verificationCode={userActionRow.token} baseUrl={baseUrl} />,
        ),
        createdAt: userActionRow.createdAt,
      };
    case 'reset-password':
      return {
        success: true,
        subject: 'Reset password',
        mailTemplate: await render(
          <ForgotPasswordTemplate actionUrl={actionUrl} baseUrl={baseUrl} />,
        ),
        createdAt: userActionRow.createdAt,
      };
    default:
      return undefined;
  }
}

export async function createInformationMailTemplate(
  information: InformationEmailMetadata,
  email?: string,
) {
  switch (information.type) {
    case 'email-verified-success':
      return buildInformationEmailTemplate({
        subject: 'Account verified',
        header: 'Account activated',
        content: `Your account has been successfully activated. ${email !== undefined ? `You can now log in with your email address ${email}.` : ''}`,
      });
    case 'reset-password-success':
      return buildInformationEmailTemplate({
        subject: 'Password reset',
        header: 'Password reset',
        content: `Your password has been successfully reset.`,
      });
    case 'account-delete-success':
      return buildInformationEmailTemplate({
        subject: 'Account deleted',
        header: 'Account deleted',
        content: `We are sad to see you go. Your account has been successfully deleted.`,
      });
    case 'invoice-paid':
      return buildInformationEmailTemplate({
        subject: 'Invoice paid',
        header: 'Invoice paid',
        content: `Your invoice has been successfully paid. Thank you for your payment.`,
      });
  }
}
