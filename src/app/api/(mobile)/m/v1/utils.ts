import { env } from '@/env';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const jwtSecret = env.jwtSecret;

const generalJWTSchema = z.object({
  iat: z.number(),
  exp: z.number(),
});

export const userJWTSchema = z
  .object({
    id: z.string(),
    email: z.string().email(),
    name: z.string().nullable(),
  })
  .and(generalJWTSchema);

export function getUserFromHeaders(headers: Headers) {
  const authorizationHeader = headers.get('Authorization')?.toString();

  if (authorizationHeader === undefined || !authorizationHeader?.startsWith('Bearer ')) {
    throw Error('Invalid Authorization Header');
  }

  const encryptedToken = authorizationHeader.substring('Bearer '.length);
  const decryptedToken = jwt.verify(encryptedToken, jwtSecret);
  const user = userJWTSchema.parse(decryptedToken);

  return user;
}

export function generateToken({ id, email, name }: { id: string; email: string; name: string }) {
  return jwt.sign({ id, email, name }, jwtSecret, {
    expiresIn: '30d',
  });
}
