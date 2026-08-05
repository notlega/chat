import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { anonymous, jwt } from "better-auth/plugins";
import { SignJWT } from "jose";
import { nanoid } from "nanoid";

import { db } from "../db";
import {
  accountsTable,
  jwkssTable,
  sessionsTable,
  usersTable,
  verificationsTable,
} from "../db/schema";

export const auth = betterAuth({
  // experimental: { joins: true }, // incompatible with Drizzle v2 defineRelations API
  basePath: "/auth",
  trustedOrigins: [process.env.CLIENT_URL],
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    schema: {
      users: usersTable,
      sessions: sessionsTable,
      accounts: accountsTable,
      verifications: verificationsTable,
      jwkss: jwkssTable,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    anonymous({ generateName: () => `user-${nanoid(16)}` }),
    jwt({
      jwt: {
        issuer: process.env.BETTER_AUTH_URL,
        audience: "centrifugo",
        sign: async (payload) =>
          new SignJWT(payload)
            .setProtectedHeader({ alg: "HS256" })
            .sign(new TextEncoder().encode(process.env.BETTER_AUTH_SECRET)),
      },
      jwks: {
        remoteUrl: `${process.env.BETTER_AUTH_URL}/auth/jwks`,
        keyPairConfig: { alg: "RS256" },
      },
    }),
  ],
});
