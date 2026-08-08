import { fromNodeHeaders } from "better-auth/node";
import type { FastifyPluginCallback } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import { csrfUserInfo } from "@/libs";

export const auth: FastifyPluginCallback = (app, _opts, done) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/csrf-token",
    {
      preHandler: app.auth([app.authenticate]),
      schema: {
        response: {
          200: z.object({ csrfToken: z.string() }),
        },
      },
    },
    async (req, rep) => {
      const csrfToken = rep.generateCsrf({ userInfo: csrfUserInfo(req) });

      return { csrfToken };
    },
  );

  // this route MUST be the last route
  app.withTypeProvider<ZodTypeProvider>().route({
    method: ["GET", "POST"],
    url: "*",
    schema: {
      tags: ["auth"],
      description: "generic catch all auth routes",
    },
    handler: async (req, rep) => {
      const url = new URL(req.url, `http://${req.headers.host}`);

      const headers = fromNodeHeaders(req.headers);
      const request = new Request(url.toString(), {
        method: req.method,
        headers,
        ...(req.body ? { body: JSON.stringify(req.body) } : {}),
      });

      const response = await app.betterAuth.handler(request);

      rep.status(response.status);
      response.headers.forEach((value, key) => {
        rep.header(key, value);
      });

      return rep.send(response.body ? await response.text() : null);
    },
  });

  done();
};
