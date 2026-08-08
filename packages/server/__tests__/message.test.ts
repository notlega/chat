import { Centrifugo } from "@chat/centrifugo";
import {
  type Message,
  type MessageWithUser,
  messageSchema,
  messagesWithPaginationSchema,
} from "@chat/contracts";
import { describe, expect, vi } from "vitest";

import { CHANNEL } from "@/libs";
import { MessageRepository } from "@/modules/message/message.repository";
import { UserRepository } from "@/modules/user/user.repository";

import { getCsrfToken, signInAnonymous, test } from "./libs/utils";

function makeMessage(): Message {
  return {
    id: "m1",
    userId: "u1",
    content: "hello",
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
  };
}

function makeRow(index: number): MessageWithUser {
  return {
    ...makeMessage(),
    id: `m${index}`,
    content: `message ${index}`,
    user: { id: "u1", name: "Alice" },
  };
}

function makeRows(count: number): Array<MessageWithUser> {
  return Array.from({ length: count }, (_, index) => makeRow(index));
}

describe("GET /messages", () => {
  test("should return 401 when the user is not authenticated", async ({
    app,
  }) => {
    const response = await app.inject({
      method: "GET",
      url: "/messages",
    });

    expect(response.statusCode).toBe(401);
    expect(JSON.parse(response.body)).toMatchObject({
      name: "UnauthorisedError",
      status: 401,
    });
  });

  test("should return 400 when limit is below the minimum", async ({ app }) => {
    const response = await app.inject({
      method: "GET",
      url: "/messages?limit=5",
    });

    expect(response.statusCode).toBe(400);
  });

  test("should return 400 when offset is not a number", async ({ app }) => {
    const response = await app.inject({
      method: "GET",
      url: "/messages?offset=abc",
    });

    expect(response.statusCode).toBe(400);
  });

  test("should request limit + 1 rows and report hasMore", async ({ app }) => {
    const getMessages = vi
      .spyOn(MessageRepository.prototype, "getMessages")
      .mockResolvedValue(makeRows(31));
    const sessionCookie = await signInAnonymous(app);

    const response = await app.inject({
      method: "GET",
      url: "/messages?offset=30",
      headers: { cookie: sessionCookie },
    });

    expect(getMessages).toHaveBeenCalledWith(31, 30);
    expect(response.statusCode).toBe(200);

    const body = JSON.parse(response.body);
    expect(body.messages).toHaveLength(30);
    expect(body.hasMore).toBe(true);
  });

  test("should set hasMore to false when a page is not full", async ({
    app,
  }) => {
    vi.spyOn(MessageRepository.prototype, "getMessages").mockResolvedValue(
      makeRows(20),
    );
    const sessionCookie = await signInAnonymous(app);

    const response = await app.inject({
      method: "GET",
      url: "/messages",
      headers: { cookie: sessionCookie },
    });

    expect(response.statusCode).toBe(200);

    const body = JSON.parse(response.body);
    expect(body.messages).toHaveLength(20);
    expect(body.hasMore).toBe(false);
  });

  test("should return a response that matches the pagination contract", async ({
    app,
  }) => {
    vi.spyOn(MessageRepository.prototype, "getMessages").mockResolvedValue(
      makeRows(30),
    );
    const sessionCookie = await signInAnonymous(app);

    const response = await app.inject({
      method: "GET",
      url: "/messages",
      headers: { cookie: sessionCookie },
    });

    expect(response.statusCode).toBe(200);

    const parsed = messagesWithPaginationSchema.parse(
      JSON.parse(response.body),
    );
    expect(parsed.messages).toHaveLength(30);
    expect(parsed.hasMore).toBe(false);
    expect(parsed.messages[0]?.createdAt).toBeInstanceOf(Date);
    expect(Number.isNaN(parsed.messages[0]?.createdAt.getTime())).toBe(false);
  });

  test("should default offset to 0 when omitted", async ({ app }) => {
    const getMessages = vi
      .spyOn(MessageRepository.prototype, "getMessages")
      .mockResolvedValue([]);
    const sessionCookie = await signInAnonymous(app);

    await app.inject({
      method: "GET",
      url: "/messages",
      headers: { cookie: sessionCookie },
    });

    expect(getMessages).toHaveBeenCalledWith(31, 0);
  });
});

describe("POST /messages", () => {
  test("should return 403 when the CSRF token is missing", async ({ app }) => {
    const sessionCookie = await signInAnonymous(app);

    const response = await app.inject({
      method: "POST",
      url: "/messages",
      headers: {
        "content-type": "application/json",
        cookie: sessionCookie,
      },
      payload: JSON.stringify({ content: "hello" }),
    });

    expect(response.statusCode).toBe(403);
  });

  test("should return 500 when saving the message returns no row", async ({
    app,
  }) => {
    vi.spyOn(MessageRepository.prototype, "saveMessage").mockResolvedValue(
      undefined,
    );
    const sessionCookie = await signInAnonymous(app);
    const { token, cookie } = await getCsrfToken(app, sessionCookie);

    const response = await app.inject({
      method: "POST",
      url: "/messages",
      headers: {
        "content-type": "application/json",
        "x-csrf-token": token,
        cookie,
      },
      payload: JSON.stringify({ content: "hello" }),
    });

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toMatchObject({
      name: "InternalServerError",
      message: "no save message",
      status: 500,
    });
  });

  test("should return 404 when the user does not exist", async ({ app }) => {
    vi.spyOn(MessageRepository.prototype, "saveMessage").mockResolvedValue(
      makeMessage(),
    );
    vi.spyOn(UserRepository.prototype, "getUser").mockResolvedValue(undefined);
    const sessionCookie = await signInAnonymous(app);
    const { token, cookie } = await getCsrfToken(app, sessionCookie);

    const response = await app.inject({
      method: "POST",
      url: "/messages",
      headers: {
        "content-type": "application/json",
        "x-csrf-token": token,
        cookie,
      },
      payload: JSON.stringify({ content: "hello" }),
    });

    expect(response.statusCode).toBe(404);
    expect(JSON.parse(response.body)).toMatchObject({
      name: "NotFoundError",
      status: 404,
    });
  });

  test("should publish to the chat channel with the user attached", async ({
    app,
  }) => {
    const message = makeMessage();
    vi.spyOn(MessageRepository.prototype, "saveMessage").mockResolvedValue(
      message,
    );
    vi.spyOn(UserRepository.prototype, "getUser").mockResolvedValue({
      id: "u1",
      name: "Alice",
    } as never);
    const publish = vi
      .spyOn(Centrifugo.prototype, "publish")
      .mockResolvedValue(undefined as never);
    const sessionCookie = await signInAnonymous(app);
    const { token, cookie } = await getCsrfToken(app, sessionCookie);

    const response = await app.inject({
      method: "POST",
      url: "/messages",
      headers: {
        "content-type": "application/json",
        "x-csrf-token": token,
        cookie,
      },
      payload: JSON.stringify({ content: "hello" }),
    });

    expect(response.statusCode).toBe(200);
    expect(publish).toHaveBeenCalledWith(CHANNEL, {
      ...message,
      user: { id: "u1", name: "Alice" },
    });
  });

  test("should return a message that matches the contract", async ({ app }) => {
    vi.spyOn(MessageRepository.prototype, "saveMessage").mockResolvedValue(
      makeMessage(),
    );
    vi.spyOn(UserRepository.prototype, "getUser").mockResolvedValue({
      id: "u1",
      name: "Alice",
    } as never);
    vi.spyOn(Centrifugo.prototype, "publish").mockResolvedValue(
      undefined as never,
    );
    const sessionCookie = await signInAnonymous(app);
    const { token, cookie } = await getCsrfToken(app, sessionCookie);

    const response = await app.inject({
      method: "POST",
      url: "/messages",
      headers: {
        "content-type": "application/json",
        "x-csrf-token": token,
        cookie,
      },
      payload: JSON.stringify({ content: "hello" }),
    });

    expect(response.statusCode).toBe(200);

    const parsed = messageSchema.parse(JSON.parse(response.body).message);
    expect(parsed.id).toBe("m1");
    expect(parsed.userId).toBe("u1");
    expect(parsed.content).toBe("hello");
    expect(parsed.createdAt).toBeInstanceOf(Date);
    expect(Number.isNaN(parsed.createdAt.getTime())).toBe(false);
  });
});
