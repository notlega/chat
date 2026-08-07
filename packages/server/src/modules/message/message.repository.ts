import type { Message, MessageWithUser } from "@chat/contracts";
import type { FastifyInstance } from "fastify";
import { nanoid } from "nanoid";
import { messagesTable } from "@/db/schema";

export class MessageRepository {
  private app: FastifyInstance;

  constructor(app: FastifyInstance) {
    this.app = app;
  }

  async saveMessage(
    userId: string,
    content: string,
  ): Promise<Message | undefined> {
    const id = nanoid();
    const [saved] = await this.app.db
      .insert(messagesTable)
      .values({ id, userId, content })
      .returning();

    return saved;
  }

  async getMessages(
    limit: number,
    offset: number,
  ): Promise<Array<MessageWithUser>> {
    return await this.app.db.query.messagesTable.findMany({
      limit,
      offset,
      orderBy: (table, { asc }) => [asc(table.createdAt), asc(table.id)],
      with: {
        user: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
    });
  }
}
