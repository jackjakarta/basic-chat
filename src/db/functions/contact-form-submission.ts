import { db } from '..';
import {
  contactFormSubmissionTable,
  type ContactFormSubmissionRow,
  type InsertContactFormSubmissionRow,
} from '../schema';

export async function dbInsertContactFormSubmission(
  data: InsertContactFormSubmissionRow,
): Promise<ContactFormSubmissionRow | undefined> {
  const [inserted] = await db.insert(contactFormSubmissionTable).values(data).returning();

  return inserted;
}
