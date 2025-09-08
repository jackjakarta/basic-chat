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
      if (!user) return token;

      const email = user.email ?? '';
      const [firstName = '', lastName = ''] = (user.name ?? '').split(' ');
      const authProvider = account?.provider === 'github' ? 'github' : 'google';

      const maybeUser = await dbGetUserByEmail({ email: user.email ?? '' });

      if (maybeUser === undefined) {
        const newUser = await dbCreateNewUser({
          email,
          firstName,
          lastName,
          password: '',
          emailVerified: true,
          authProvider,
        });

        const stripeCustomer = await createCustomerByEmailStripe({
          email: newUser.email,
          userId: newUser.id,
        });

        await dbUpdateUserCustomerId({
          userId: newUser.id,
          customerId: stripeCustomer.id,
        });

        return { ...token, user: newUser };
      }

      return { ...token, user: maybeUser };
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
