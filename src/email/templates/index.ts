import { dbInsertOrUpdateActionToken } from '@/db/functions/token';
import { dbGetUserByEmail } from '@/db/functions/user';
import { type TokenAction } from '@/db/schema';
import { buildUserActionUrl } from '@/utils/url';

import { type InformationEmailMetadata, type MailTemplateResponse } from '../types';
import { buildInformationEmailTemplate } from './information-template';
import { resetPasswordTemplate } from './reset-password';
import { verifyMailTemplate } from './verify-email';

export async function createUserActionMailTemplate(
  email: string,
  action: TokenAction,
): Promise<MailTemplateResponse | undefined> {
  if (action === 'reset-password' && (await dbGetUserByEmail({ email })) === undefined) {
    console.warn(`Cannot send email to non-existing user with email '${email}'`);
    return undefined;
  }

  const userActionRow = await dbInsertOrUpdateActionToken({ email, action });

  if (userActionRow === undefined) {
    console.warn(`Failed to retrieve or create action token for email '${email}'`);
    return undefined;
  }

  const searchParams = new URLSearchParams({
    token: userActionRow.token,
  });

  const actionUrl = buildUserActionUrl({ searchParams });

  switch (action) {
    case 'verify-email':
      return {
        success: true,
        subject: verifyMailTemplate({ verifyCode: userActionRow.token }).Subject.Data,
        mailTemplate: verifyMailTemplate({ verifyCode: userActionRow.token }).Body.Html.Data,
        createdAt: userActionRow.createdAt,
      };
    case 'reset-password':
      return {
        success: true,
        subject: resetPasswordTemplate({ actionUrl }).Subject.Data,
        mailTemplate: resetPasswordTemplate({ actionUrl }).Body.Html.Data,
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
      return buildInformationEmailTemplate(
        'Account verified',
        'Account activated',
        `Your account has been successfully activated. ${email !== undefined ? `You can now log in with your email address ${email}.` : ''}`,
      );
    case 'reset-password-success':
      return buildInformationEmailTemplate(
        'Password reset',
        'Password reset',
        `Your password has been successfully reset.`,
      );
    case 'account-delete-success':
      return buildInformationEmailTemplate(
        'Account deleted',
        'Account deleted',
        `We are sad to see you go. Your account has been successfully deleted.`,
      );
  }
}
