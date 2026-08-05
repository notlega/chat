import fastifyPlugin from "fastify-plugin";

import { auth } from "@/utils/auth";

export const betterAuthPlugin = fastifyPlugin(async (fastify) => {
  fastify.decorate("betterAuth", auth);
  fastify.decorateRequest("betterAuth", {
    getter: () => auth,
  });
});
