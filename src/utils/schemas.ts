import { env } from '@/env';
import { z } from 'zod';

import { getPasswordValidator } from './password';

export const firstNameSchema = z.string().min(1, 'First name is required');
export const lastNameSchema = z.string().min(1, 'Last name is required');
export const emailSchema = z.string().email('Invalid email address');

export const passwordValidatorSchema = z.enum(['weak', 'medium', 'strong']);
export const passwordSchema = getPasswordValidator({ level: env.NEXT_PUBLIC_passwordValidator });
