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

  async function renderInformationTemplate({
    header,
    subject,
    content,
  }: {
    header: string;
    subject: string;
    content: string;
  }) {
    const [html, text] = await Promise.all([
      render(<InformationTemplate header={header} content={content} baseUrl={baseUrl} />),
      render(<InformationTemplate header={header} content={content} baseUrl={baseUrl} />, {
        plainText: true,
      }),
    ]);

    return {
      success: true,
      subject: subject,
      mailTemplate: html,
      textPart: text,
    };
  }

  switch (information.type) {
    case 'email-verified-success': {
      return renderInformationTemplate({
        subject: 'Email verified',
        header: 'Email verified',
        content: `Your email address has been successfully verified. You can now log in with your email address ${email}.`,
      });
    }

    case 'reset-password-success': {
      return renderInformationTemplate({
        subject: 'Password changed',
        header: 'Password changed',
        content: 'Your password has been successfully changed.',
      });
    }

    case 'account-delete-success': {
      return renderInformationTemplate({
        subject: 'Account deleted',
        header: 'Account deleted',
        content: 'We are sad to see you go. Your account has been successfully deleted.',
      });
    }

    case 'invoice-paid': {
      return renderInformationTemplate({
        subject: 'Invoice paid',
        header: 'Invoice paid',
        content: 'Your invoice has been successfully paid. Thank you for your payment!',
      });
    }

    case 'contact_form_submission': {
      return renderInformationTemplate({
        subject: 'We received your message',
        header: 'We received your message',
        content: `Thank you for reaching out to us. We have received your message:
        
        "${information.message}"
        
        Our team will get back to you as soon as possible.`,
      });
    }

    default:
      return undefined;
  }
}
