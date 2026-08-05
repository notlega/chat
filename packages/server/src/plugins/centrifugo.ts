import { Centrifugo } from "@chat/centrifugo";
import fastifyPlugin from "fastify-plugin";

export const centrifugoPlugin = fastifyPlugin(async (fastify) => {
  const centrifugo = new Centrifugo(
    process.env.CENTRIFUGO_URL,
    process.env.CENTRIFUGO_API_KEY,
  );

  fastify.decorate("centrifugo", centrifugo);
});
