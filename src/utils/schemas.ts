import { z } from 'zod';

import { getPasswordValidator } from './password';

export const firstNameSchema = z.string().min(1, 'First name is required');
export const lastNameSchema = z.string().min(1, 'Last name is required');
export const emailSchema = z.string().email('Invalid email address');
export const passwordSchema = getPasswordValidator();

export const appLocaleSchema = z.enum(['en', 'de', 'ro', 'es']);

export const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters long')
    .max(1500, 'Message must be at most 1500 characters long'),
});
