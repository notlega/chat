import type { FastifyPluginCallback } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import { checkDB } from "./health.service";

export const health: FastifyPluginCallback = (app, _opts, done) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/live",
    {
      schema: {
        tags: ["health"],
        description: "checks if server is live",
        response: {
          200: z
            .object({
              status: z.string(),
            })
            .describe("system live success response"),
          500: z
            .object({
              status: z.string(),
            })
            .describe("system live error response"),
        },
      },
    },
    async () => {
      return {
        status: "ok",
      };
    },
  );

  app.withTypeProvider<ZodTypeProvider>().get(
    "/ready",
    {
      schema: {
        tags: ["health"],
        description: "checks db connection",
        response: {
          200: z
            .object({
              status: z.string(),
            })
            .describe("db connection success response"),
          503: z
            .object({
              status: z.string(),
            })
            .describe("db connection error response"),
        },
      },
    },
    async (_req, rep) => {
      try {
        await checkDB(app);
      } catch {
        return rep.code(503).send({
          status: "not_ready",
        });
      }

      return {
        status: "ready",
      };
    },
  );

  done();
};
