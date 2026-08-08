import {
  messageSchema,
  messagesWithPaginationSchema,
  messageWithUserSchema,
} from "@chat/contracts";
import { describe, expect, it } from "vitest";

const isoCreatedAt = "2026-01-01T00:00:00.000Z";
const isoUpdatedAt = "2026-01-02T00:00:00.000Z";

describe("messageSchema", () => {
  it("coerces ISO date strings into Date instances", () => {
    const parsed = messageSchema.parse({
      id: "m1",
      userId: "u1",
      content: "hello",
      createdAt: isoCreatedAt,
      updatedAt: isoUpdatedAt,
    });

    expect(parsed.createdAt).toBeInstanceOf(Date);
    expect(parsed.updatedAt).toBeInstanceOf(Date);
    expect(parsed.createdAt.toISOString()).toBe(isoCreatedAt);
  });

  it("rejects invalid date strings", () => {
    expect(() =>
      messageSchema.parse({
        id: "m1",
        userId: "u1",
        content: "hello",
        createdAt: "not-a-date",
        updatedAt: isoUpdatedAt,
      }),
    ).toThrow();
  });
});

describe("messageWithUserSchema", () => {
  it("parses a message with an embedded user", () => {
    const parsed = messageWithUserSchema.parse({
      id: "m1",
      userId: "u1",
      content: "hello",
      createdAt: isoCreatedAt,
      updatedAt: isoUpdatedAt,
      user: { id: "u1", name: "Alice" },
    });

    expect(parsed.user).toEqual({ id: "u1", name: "Alice" });
    expect(parsed.createdAt).toBeInstanceOf(Date);
  });
});

describe("messagesWithPaginationSchema", () => {
  it("round-trips a serialized page back to Date instances", () => {
    const page = {
      messages: [
        {
          id: "m1",
          userId: "u1",
          content: "hello",
          createdAt: new Date(isoCreatedAt),
          updatedAt: new Date(isoUpdatedAt),
          user: { id: "u1", name: "Alice" },
        },
      ],
      hasMore: true,
    };

    const wire = JSON.parse(JSON.stringify(page));
    const parsed = messagesWithPaginationSchema.parse(wire);

    expect(parsed.hasMore).toBe(true);
    expect(parsed.messages[0]?.createdAt).toBeInstanceOf(Date);
    expect(parsed.messages[0]?.createdAt.toISOString()).toBe(isoCreatedAt);
  });
});
