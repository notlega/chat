import { messageSchema, messagesWithPaginationSchema } from "@chat/contracts";
import type { FastifyPluginCallback } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { stringToNumberSchema, unsafePreprocessor } from "@/libs";
import { MessageService } from "./message.service";

export const message: FastifyPluginCallback = (app, _opts, done) => {
  app.addHook("preHandler", app.auth([app.authenticate]));

  app.withTypeProvider<ZodTypeProvider>().get(
    "/",
    {
      schema: {
        querystring: z.object({
          limit: z.preprocess(
            unsafePreprocessor(stringToNumberSchema(30)),
            z.number().min(30).max(100),
          ),
          offset: z.preprocess(
            unsafePreprocessor(stringToNumberSchema(0)),
            z.number().min(0),
          ),
        }),
        response: {
          200: messagesWithPaginationSchema,
        },
      },
    },
    async (req) => {
      const { limit, offset } = req.query;

      const messageService = new MessageService(
        app.repos.message,
        app.repos.user,
        app.centrifugo,
      );
      const rows = await messageService.getMessages(limit + 1, offset);
      const hasMore = rows.length > limit;
      const messages = rows.slice(0, limit);

      return { messages, hasMore };
    },
  );

  app.withTypeProvider<ZodTypeProvider>().post(
    "/",
    {
      schema: {
        body: z.object({
          content: z.string().min(1).max(4000),
        }),
        response: {
          200: z.object({ message: messageSchema }),
        },
      },
      preHandler: [app.csrfProtection],
    },

    async (req) => {
      const { content } = req.body;
      const userId = req.user.id;

      const messageService = new MessageService(
        app.repos.message,
        app.repos.user,
        app.centrifugo,
      );
      const message = await messageService.sendMessage(userId, content);

      return { message };
    },
  );

  done();
};
