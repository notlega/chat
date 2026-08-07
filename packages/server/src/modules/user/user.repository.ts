import { eq, type InferSelectModel } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { usersTable } from "@/db/schema";

export class UserRepository {
  private app: FastifyInstance;

  constructor(app: FastifyInstance) {
    this.app = app;
  }

  async getUser(
    userId: string,
  ): Promise<InferSelectModel<typeof usersTable> | undefined> {
    const [user] = await this.app.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId));

    return user;
  }
}
