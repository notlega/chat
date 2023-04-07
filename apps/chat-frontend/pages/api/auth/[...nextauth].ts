import NextAuth, { type NextAuthOptions, type User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import fetch from 'node-fetch';

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (credentials === undefined) return null;

        const { email, password } = credentials;

        const res = await fetch(
          `${process.env.FRONTEND_URL ?? ''}/auth/login`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              password,
            }),
          }
        );

        const { user }: {user: User} = await (res.json() as any);

        if (res.ok && user !== null) return user;

        return null;
      },
    }),
  ],
};

export default NextAuth(authOptions);
