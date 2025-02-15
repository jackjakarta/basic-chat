import { z } from 'zod';

import { type PasswordValidatorLevel } from './types';

export function getPasswordValidator({ level }: { level: PasswordValidatorLevel }) {
  switch (level) {
    case 'weak':
      return z.string().min(4, 'Password must be at least 4 characters');

    case 'medium':
      return z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
        .regex(/[a-z]/, 'Password must include at least one lowercase letter')
        .regex(/\d/, 'Password must include at least one number');

    case 'strong':
      return z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
        .regex(/[a-z]/, 'Password must include at least one lowercase letter')
        .regex(/\d/, 'Password must include at least one number')
        .regex(/[@$!%*?&]/, 'Password must include at least one special character');

    default:
      throw new Error(`Unknown password validator level: ${level}`);
  }
}
