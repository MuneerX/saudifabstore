import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import User from '@/lib/models/User';
import connectToDatabase from '@/lib/db/connect';

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

        // Hardcoded admin fallback for demo/testing convenience
        if (
          (credentials.email === 'admin@brooqalkhalij.com' || credentials.email === 'admin@example.com') && 
          credentials.password === 'admin123'
        ) {
          return {
            id: 'admin-static-id',
            name: 'Brooq Admin',
            email: credentials.email,
            role: 'admin',
          };
        }

        try {
          await connectToDatabase();
          const user = await User.findOne({ email: credentials.email });
          if (user) {
            const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
            if (isPasswordValid) {
              return {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
              };
            }
          }
        } catch (dbErr) {
          console.warn("Auth database connection failed, checking static credentials only:", dbErr);
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
      // Always redirect to /profile after login
      if (url.startsWith(baseUrl)) {
        return `${baseUrl}/profile`;
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
  secret: process.env.NEXTAUTH_SECRET
};

export default NextAuth(authOptions);