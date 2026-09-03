import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { findUserByEmail } from '@/lib/userStore';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials');
        }

        const normalizedInput = credentials.email.toLowerCase().trim();

        // 1. Look up user in Database & Runtime User Registry by email or phone
        const user = await findUserByEmail(normalizedInput);
        if (user) {
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          if (isPasswordValid) {
            return {
              id: user.id,
              name: user.name,
              email: user.email || user.phone || normalizedInput,
              role: user.role,
            };
          }
        }

        // 2. Hardcoded admin fallback for demo/testing convenience
        if (
          (normalizedEmail === 'admin@saudifabstore.com' || normalizedEmail === 'admin@example.com') && 
          credentials.password === 'admin123'
        ) {
          return {
            id: 'admin-static-id',
            name: 'Saudi Fab Admin',
            email: normalizedEmail,
            role: 'admin',
          };
        }

        throw new Error('Invalid email or password');
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      } else if (new URL(url).origin === baseUrl) {
        return url;
      }
      return baseUrl;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "saudifabstore-production-nextauth-secret-key-2026-super-secret"
};

export default NextAuth(authOptions);