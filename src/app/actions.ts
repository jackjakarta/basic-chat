'use server';

import { dbInsertContactFormSubmission } from '@/db/functions/contact-form-submission';
import { type InsertContactFormSubmissionRow } from '@/db/schema';
import { sendUserActionInformationEmail } from '@/email/send';

export async function insertContactFormSubmissionAction(data: InsertContactFormSubmissionRow) {
  const newFormSubmission = await dbInsertContactFormSubmission(data);

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
