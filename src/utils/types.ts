import { z } from 'zod';

import { siteLanguageSchema } from './schemas';

export type SVGProps = React.ComponentProps<'svg'>;
export type SiteLanguage = z.infer<typeof siteLanguageSchema>;

export type PasswordValidatorLevel = 'weak' | 'medium' | 'strong';
export type WithSignedUrl<T> = T & { signedUrl: string };
