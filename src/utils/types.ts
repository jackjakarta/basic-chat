import { z } from 'zod';

import { passwordValidatorSchema } from './schemas';

export type SVGProps = React.ComponentProps<'svg'>;
export type PasswordValidatorLevel = z.infer<typeof passwordValidatorSchema>;
