import * as z from "zod";

const messageSchema = z.object({
  id: z.string(),
  userId: z.string(),
  content: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

const messageWithUserSchema = z.object({
  user: z.object({
    id: z.string(),
    name: z.string(),
  }),
  ...messageSchema.shape,
});

const messagesWithPaginationSchema = z.object({
  messages: messageWithUserSchema.array(),
  hasMore: z.boolean(),
});

type Message = z.infer<typeof messageSchema>;
type MessageWithUser = z.infer<typeof messageWithUserSchema>;
type MessagesWithPagination = z.infer<typeof messagesWithPaginationSchema>;

export type { Message, MessagesWithPagination, MessageWithUser };
export { messageSchema, messagesWithPaginationSchema, messageWithUserSchema };
