import { z } from 'zod';

import { passwordValidatorSchema, siteLanguageSchema } from './schemas';

export type SVGProps = React.ComponentProps<'svg'>;
export type PasswordValidatorLevel = z.infer<typeof passwordValidatorSchema>;
export type SiteLanguage = z.infer<typeof siteLanguageSchema>;
