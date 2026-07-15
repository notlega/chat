import type { Centrifugo } from "@chat/centrifugo";
import type { Session, User } from "better-auth";
import { z } from "zod";
import type { authenticate } from "@/libs";
import type { MessageRepository } from "@/modules/message/message.repository";
import type { UserRepository } from "@/modules/user/user.repository";
import type { database } from "@/types";
import type { auth } from "@/utils/auth";

const envSchema = z.object({
  ADDRESS: z.string(),
  PORT: z.string(),
  CLIENT_URL: z.string(),
  SERVER_URL: z.string(),
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.string(),
  DATABASE_URL: z.string(),
  CENTRIFUGO_URL: z.string(),
  CENTRIFUGO_API_KEY: z.string(),
});

declare global {
  namespace NodeJS {
    type NODE_ENV = "development" | "test" | "production";
    interface ProcessEnv extends z.infer<typeof envSchema> {
      NODE_ENV: NODE_ENV;
    }
  }
}

declare module "fastify" {
  interface FastifyInstance {
    db: database;
    betterAuth: typeof auth;
    authenticate: typeof authenticate;
    repos: {
      user: UserRepository;
      message: MessageRepository;
    };
    centrifugo: Centrifugo;
  }

  interface FastifyRequest {
    betterAuth: typeof auth;
    session: Session;
    user: User;
  }
}
