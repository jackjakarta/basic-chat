import { appLocaleSchema } from '@/utils/schemas';
import { z } from 'zod';

export type SVGProps = React.ComponentProps<'svg'>;
export type AppLocale = z.infer<typeof appLocaleSchema>;

export type PasswordValidatorLevel = 'weak' | 'medium' | 'strong';
export type WithSignedUrl<T> = T & { signedUrl: string };
