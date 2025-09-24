import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';

import { prisma } from './prisma';

type Credentials = {
  email: string;
  password: string;
};

type AuthConfig = {
  session?: {
    strategy?: 'jwt' | 'database';
  };
  pages?: {
    signIn?: string;
  };
  providers: ReturnType<typeof CredentialsProvider>[];
  callbacks?: Record<string, unknown>;
};

export const authOptions: AuthConfig = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const creds = credentials as Credentials | null;
        if (!creds?.email || !creds?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({ where: { email: creds.email } });
        if (!user) {
          return null;
        }

        const passwordValid = await bcrypt.compare(creds.password, user.passwordHash);
        if (!passwordValid) {
          return null;
        }

        return {
          id: String(user.id),
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    async session({
      session,
      token,
    }: {
      session: Record<string, unknown>;
      token: Record<string, unknown>;
    }) {
      if (session.user && typeof token.sub === 'string') {
        (session.user as { id?: string }).id = token.sub;
      }
      return session;
    },
  },
};
