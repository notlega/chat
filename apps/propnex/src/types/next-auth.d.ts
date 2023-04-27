import NextAuth from 'next-auth/next';

declare module 'next-auth/next' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: User;
  }

  interface User {
    id: string;
    name: string;
    email: string;
    email_verified: Date;
    password: string;
    image: string;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    accessToken: string;
    accessTokenExpires: number;
    refreshToken: string;
    user: User;
  }
}
