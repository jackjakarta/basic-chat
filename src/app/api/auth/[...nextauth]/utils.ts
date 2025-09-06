import {
  dbCreateNewUser,
  dbGetAuthenticatedUser,
  dbGetUserByEmail,
  dbUpdateUserCustomerId,
} from '@/db/functions/user';
import { type UserRow } from '@/db/schema';
import { env } from '@/env';
import { createCustomerByEmailStripe } from '@/stripe/customer';
import { type AuthOptions } from 'next-auth';
import credentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { z } from 'zod';

const isCI = !!process.env.CI;

const credentialsSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const authOptions = {
  providers: [
    credentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'you@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      // @ts-expect-error - We're not using the type here
      async authorize(credentials) {
        try {
          const creds = credentialsSchema.parse(credentials);
          const user = await dbGetAuthenticatedUser({ ...creds });
          return user;
        } catch (e) {
          console.error('Login error:', e);
          return null;
        }
      },
    }),
    GitHubProvider({
      clientId: env.githubClientId,
      clientSecret: env.githubClientSecret,
    }),
    GoogleProvider({
      clientId: env.googleClientId,
      clientSecret: env.googleClientSecret,
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    session({ token, session }) {
      session.user = token.user as UserRow;
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        let dbUser;

        try {
          dbUser = await dbGetUserByEmail({ email: user.email ?? '' });

          if (dbUser === undefined) {
            throw new Error('User not found');
          }
        } catch {
          dbUser = await dbCreateNewUser({
            email: user.email ?? '',
            firstName: user.name?.split(' ')[0] ?? '',
            lastName: user.name?.split(' ')[1] ?? '',
            password: '',
            emailVerified: true,
            authProvider: account?.provider === 'github' ? 'github' : 'google',
          });

          const stripeCustomer = await createCustomerByEmailStripe({
            email: dbUser.email,
            userId: dbUser.id,
          });

          await dbUpdateUserCustomerId({
            userId: dbUser.id,
            customerId: stripeCustomer.id,
          });
        }
        return { user: dbUser };
      }

      return token;
    },
  },
  jwt: {
    maxAge: 15 * 24 * 60 * 60, // 15 days
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: isCI ? false : undefined,
      },
    },
  },
} satisfies AuthOptions;
