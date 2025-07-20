import { dbInsertOrUpdateActionToken } from '@/db/functions/token';
import { dbGetUserByEmail } from '@/db/functions/user';
import { type TokenAction } from '@/db/schema';
import ForgotPasswordTemplate from '@/email/emails/forgot-password';
import InformationTemplate from '@/email/emails/information';
import VerifyEmailTemplate from '@/email/emails/verify-email';
import { getBaseUrlByHeaders } from '@/utils/host';
import { buildUserActionUrl } from '@/utils/url';
import { render } from '@react-email/components';

import { type InformationEmailMetadata, type MailTemplateResponse } from './types';

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
    case 'verify-email': {
      const [html, text] = await Promise.all([
        render(<VerifyEmailTemplate verificationCode={userActionRow.token} baseUrl={baseUrl} />),
        render(<VerifyEmailTemplate verificationCode={userActionRow.token} baseUrl={baseUrl} />, {
          plainText: true,
        }),
      ]);

      return {
        success: true,
        subject: 'Verify your email address',
        mailTemplate: html,
        textPart: text,
        createdAt: userActionRow.createdAt,
      };
    }
    case 'reset-password': {
      const [html, text] = await Promise.all([
        render(<ForgotPasswordTemplate actionUrl={actionUrl} baseUrl={baseUrl} />),
        render(<ForgotPasswordTemplate actionUrl={actionUrl} baseUrl={baseUrl} />, {
          plainText: true,
        }),
      ]);

      return {
        success: true,
        subject: 'Reset password',
        mailTemplate: html,
        textPart: text,
        createdAt: userActionRow.createdAt,
      };
    }
    default:
      return undefined;
  }
}

export async function createInformationMailTemplate(
  information: InformationEmailMetadata,
  email?: string,
) {
  const baseUrl = getBaseUrlByHeaders();

  switch (information.type) {
    case 'email-verified-success': {
      const [html, text] = await Promise.all([
        render(
          <InformationTemplate
            header="Email verified"
            content={`Your email address has been successfully verified. ${email !== undefined ? `You can now log in with your email address ${email}.` : ''}`}
            baseUrl={baseUrl}
          />,
        ),
        render(
          <InformationTemplate
            header="Email verified"
            content={`Your email address has been successfully verified. ${email !== undefined ? `You can now log in with your email address ${email}.` : ''}`}
            baseUrl={baseUrl}
          />,
          { plainText: true },
        ),
      ]);

      return {
        success: true,
        subject: 'Email verified',
        mailTemplate: html,
        textPart: text,
      };
    }

    case 'reset-password-success': {
      const [html, text] = await Promise.all([
        render(
          <InformationTemplate
            header="Password changed"
            content="Your password has been successfully changed."
            baseUrl={baseUrl}
          />,
        ),
        render(
          <InformationTemplate
            header="Password changed"
            content="Your password has been successfully changed."
            baseUrl={baseUrl}
          />,
          { plainText: true },
        ),
      ]);

      return {
        success: true,
        subject: 'Password changed',
        mailTemplate: html,
        textPart: text,
      };
    }

    case 'account-delete-success': {
      const [html, text] = await Promise.all([
        render(
          <InformationTemplate
            header="Account deleted"
            content="We are sad to see you go. Your account has been successfully deleted."
            baseUrl={baseUrl}
          />,
        ),
        render(
          <InformationTemplate
            header="Account deleted"
            content="We are sad to see you go. Your account has been successfully deleted."
            baseUrl={baseUrl}
          />,
          { plainText: true },
        ),
      ]);

      return {
        success: true,
        subject: 'Account deleted',
        mailTemplate: html,
        textPart: text,
      };
    }

    case 'invoice-paid': {
      const [html, text] = await Promise.all([
        render(
          <InformationTemplate
            header="Invoice paid"
            content="Your invoice has been successfully paid. Thank you for your payment!"
            baseUrl={baseUrl}
          />,
        ),
        render(
          <InformationTemplate
            header="Invoice paid"
            content="Your invoice has been successfully paid. Thank you for your payment!"
            baseUrl={baseUrl}
          />,
          { plainText: true },
        ),
      ]);

      return {
        success: true,
        subject: 'Invoice paid',
        mailTemplate: html,
        textPart: text,
      };
    }

    default: {
      return undefined;
    }
  }
}
