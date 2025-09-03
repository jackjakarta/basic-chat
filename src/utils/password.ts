import { z } from 'zod';

import { type PasswordValidatorLevel } from '../types/utils';

const weakLevelValidator = z.string().min(4, 'Password must be at least 4 characters');

const mediumLevelValidator = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
  .regex(/[a-z]/, 'Password must include at least one lowercase letter')
  .regex(/\d/, 'Password must include at least one number');

const strongLevelValidator = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
  .regex(/[a-z]/, 'Password must include at least one lowercase letter')
  .regex(/\d/, 'Password must include at least one number')
  .regex(/[@$!%*?&]/, 'Password must include at least one special character');

export function getPasswordValidator(level: PasswordValidatorLevel = 'medium') {
  switch (level) {
    case 'weak':
      return weakLevelValidator;

    case 'medium':
      return mediumLevelValidator;

    case 'strong':
      return strongLevelValidator;

    default:
      return mediumLevelValidator;
  }
}
