import "dotenv/config";
import fauth from "@fastify/auth";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import csrf from "@fastify/csrf-protection";
import helmet from "@fastify/helmet";
import multipart from "@fastify/multipart";
import type { FastifyRequest } from "fastify";
import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import {
  authenticate,
  csrfUserInfo,
  errorHandler,
  notFoundHandler,
} from "@/libs";
import { auth } from "@/modules/auth/auth.route";
import { health } from "@/modules/health/health.route";
import { message } from "@/modules/message/message.route";
import { betterAuthPlugin } from "@/plugins/auth";
import { centrifugoPlugin } from "@/plugins/centrifugo";
import { drizzlePlugin } from "@/plugins/drizzle";
import { repositoryPlugin } from "@/plugins/repository";

const serializers = {
  req(req: FastifyRequest) {
    return {
      method: req.method,
      url: req.url,
      remoteAddress: req.ip,
      remotePort: req.socket.remotePort,
      host: req.hostname,
    };
  },
};

const envToLogger = {
  development: {
    level: "debug",
    serializers,
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
  production: {
    serializers,
  },
  test: false,
};

export interface BuildAppOptions {
  betterAuth?: unknown;
}

export function buildApp(options: BuildAppOptions = {}) {
  const env = process.env.NODE_ENV || "production";
  const app = fastify({
    logger: envToLogger[env],
  });

  app.register(cookie);

  app.register(csrf, {
    csrfOpts: {
      hmacKey: process.env.BETTER_AUTH_SECRET,
    },
    getUserInfo: csrfUserInfo,
  });

  if (process.env.NODE_ENV !== "test") {
    app.register(helmet);

    app.register(drizzlePlugin);
  }

  app.register(cors, {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "X-CSRF-Token",
    ],
    credentials: true,
    maxAge: 86400,
  });

  app.register(multipart);

  app.register(fauth);

  if (options.betterAuth) {
    app.decorate("betterAuth", options.betterAuth as never);
    app.decorateRequest("betterAuth", {
      getter: () => options.betterAuth as never,
    });
  } else {
    app.register(betterAuthPlugin);
  }

  app.register(repositoryPlugin);

  app.register(centrifugoPlugin);

  app.setNotFoundHandler(notFoundHandler);

  app.setErrorHandler(errorHandler);

  app.setValidatorCompiler(validatorCompiler);

  app.setSerializerCompiler(serializerCompiler);

  app.decorate("authenticate", authenticate);

  app.register(health);

  app.register(auth, { prefix: "/auth" });

  app.register(message, { prefix: "/messages" });

  return app;
}
