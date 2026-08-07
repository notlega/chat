import fastifyPlugin from "fastify-plugin";
import { MessageRepository } from "@/modules/message/message.repository";
import { UserRepository } from "@/modules/user/user.repository";

export const repositoryPlugin = fastifyPlugin(async (fastify) => {
  const repositories = {
    user: new UserRepository(fastify),
    message: new MessageRepository(fastify),
  };

  fastify.decorate("repos", repositories);
});
