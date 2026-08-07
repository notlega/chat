import type { Centrifugo } from "@chat/centrifugo";
import type { Message, MessageWithUser } from "@chat/contracts";
import { InternalServerError, NotFoundError } from "@/errors";
import { CHANNEL } from "@/libs";
import type { UserRepository } from "../user/user.repository";
import type { MessageRepository } from "./message.repository";

export class MessageService {
  private messageRepo: MessageRepository;

  private userRepo: UserRepository;

  private centrifugo: Centrifugo;

  constructor(
    messageRepo: MessageRepository,
    userRepo: UserRepository,
    centrifugo: Centrifugo,
  ) {
    this.messageRepo = messageRepo;
    this.userRepo = userRepo;
    this.centrifugo = centrifugo;
  }

  async getMessages(
    limit: number,
    offset?: number,
  ): Promise<Array<MessageWithUser>> {
    return await this.messageRepo.getMessages(limit, offset || 0);
  }

  async sendMessage(userId: string, content: string): Promise<Message> {
    const message = await this.messageRepo.saveMessage(userId, content);

    if (message === undefined) {
      throw new InternalServerError("no save message");
    }

    const user = await this.userRepo.getUser(userId);

    if (user === undefined) {
      throw new NotFoundError("user");
    }

    await this.centrifugo.publish<MessageWithUser>(CHANNEL, {
      ...message,
      user: { id: user.id, name: user.name },
    });

    return message;
  }
}
