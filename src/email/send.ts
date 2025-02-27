import { type TokenAction } from '@/db/schema';

import { mailjet } from './client';
import { createInformationMailTemplate, createUserActionMailTemplate } from './templates';
import { type EmailActionResult, type InformationEmailMetadata } from './types';

export type SendUserActionEmail = typeof sendUserActionEmail;

/**
 * Sends emails to user with a specific user action to be executed by the user
 * via an action link. This function should only be used for sending email where the user receives
 * some kind of proceed link inside the template
 * */
export async function sendUserActionEmail({
  to,
  action,
}: {
  to: string;
  action: TokenAction;
}): Promise<EmailActionResult> {
  const result = await createUserActionMailTemplate(to, action);

  if (!result || !result.success) {
    return {
      success: false,
      error: `Could not generate mail template for action '${action}' and email: '${to}'`,
    };
  }

  const { mailTemplate, subject } = result;
  if (mailTemplate === undefined) {
    console.warn(`Could not generate mail template for action '${action}' and email: '${to}'`);
    return {
      success: false,
      error: 'For more information look inside the logs',
    };
  }

  try {
    const request = await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: 'info@klikr.app',
            Name: 'Klikr App',
          },
          To: [
            {
              Email: to,
            },
          ],
          Subject: subject,
          TextPart: 'This email is not supported by your email client.',
          HTMLPart: mailTemplate,
        },
      ],
    });

    console.log('Email successfully sent:', request.body);

    return { success: true };
  } catch (e: unknown) {
    console.error('Email send returned the following error:', e);

    return {
      success: false,
      error:
        e instanceof Error ? `${e.name}, ${e.message}, ${e.stack}` : 'error could not be parsed',
    };
  }
}

/**
 * Sends information mails to the user about some successful or not successul executed action
 * This email shall not contain any forwarding or proceed actions inside the mail and serves
 * for information purposes only
 * */
export async function sendUserActionInformationEmail({
  to,
  information,
}: {
  to: string;
  information: InformationEmailMetadata;
}) {
  const mailTemplate = await createInformationMailTemplate(information, to);

  if (mailTemplate === undefined) {
    console.warn(
      `Could not generate mail template for information '${information.type}' and email: '${to}'`,
    );

    return {
      success: false,
      error: 'For more information look inside the logs',
    };
  }

  try {
    const request = await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: 'info@klikr.app',
            Name: 'Klikr App',
          },
          To: [
            {
              Email: to,
            },
          ],
          Subject: mailTemplate.Subject.Data,
          TextPart: 'This email is not supported by your email client.',
          HTMLPart: mailTemplate.Body.Html.Data,
        },
      ],
    });

    console.log('Email successfully sent:', request.body);

    return { success: true };
  } catch (e: unknown) {
    // eslint-disable-next-line no-console
    console.error('Email send returned the following error:', e);

    return {
      success: false,
      error:
        e instanceof Error ? `${e.name}, ${e.message}, ${e.stack}` : 'error could not be parsed',
    };
  }
}
