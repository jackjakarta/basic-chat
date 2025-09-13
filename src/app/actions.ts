'use server';

import { dbInsertContactFormSubmission } from '@/db/functions/contact-form-submission';
import { type InsertContactFormSubmissionRow } from '@/db/schema';
import { sendUserActionInformationEmail } from '@/email/send';
import { contactFormSchema } from '@/utils/schemas';

export async function insertContactFormSubmissionAction(body: InsertContactFormSubmissionRow) {
  const parseResult = contactFormSchema.parse(body);
  const newFormSubmission = await dbInsertContactFormSubmission(parseResult);

  if (newFormSubmission === undefined) {
    throw new Error('Failed to save contact form submission');
  }

  const { email, message } = newFormSubmission;

  const result = await sendUserActionInformationEmail({
    to: email,
    information: { type: 'contact_form_submission', message },
  });

  if (!result.success) {
    console.error('Failed to send contact form submission email', result.error);
    throw new Error(result.error ?? 'Failed to send contact form submission email');
  }

  return newFormSubmission;
}
