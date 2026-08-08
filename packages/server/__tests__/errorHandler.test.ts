import { CentrifugoError } from "@chat/centrifugo";
import { TokenError } from "fast-jwt";
import { test as baseTest, describe, expect } from "vitest";
import { type ZodError, z } from "zod";

import { buildApp } from "@/app";
import { UnauthorisedError } from "@/errors";

function zodError(): ZodError {
  try {
    z.number().parse("not a number");
  } catch (error) {
    return error as ZodError;
  }

  throw new Error("expected a ZodError");
}

const test = baseTest.extend("app", async ({}, { onCleanup }) => {
  const app = buildApp();

  app.get("/fst", async () => {
    throw Object.assign(new Error("context error"), {
      code: "FST_ERR_CTX_GLOBAL",
      statusCode: 400,
    });
  });

  app.get("/token", async () => {
    throw new TokenError("FAST_JWT_EXPIRED", "token expired");
  });

  app.get("/base", async () => {
    throw new UnauthorisedError();
  });

  app.get("/zod", async () => {
    throw zodError();
  });

  app.get("/centrifugo", async () => {
    throw new CentrifugoError("publish failed");
  });

  app.get("/generic", async () => {
    throw new Error("super-secret-internal-detail");
  });

  app.get(
    "/validation",
    {
      schema: {
        querystring: z.object({
          limit: z.coerce.number(),
        }),
      },
    },
    async () => ({}),
  );

  await app.ready();

  onCleanup(async () => await app.close());

  return app;
});

describe("errorHandler", () => {
  test("should handle Fastify errors using the error status code", async ({
    app,
  }) => {
    const response = await app.inject({ method: "GET", url: "/fst" });

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({
      name: "FST_ERR_CTX_GLOBAL",
      status: 400,
    });
  });

  test("should handle token errors as 401", async ({ app }) => {
    const response = await app.inject({ method: "GET", url: "/token" });

    expect(response.statusCode).toBe(401);
    expect(JSON.parse(response.body)).toMatchObject({
      name: "FAST_JWT_EXPIRED",
      status: 401,
    });
  });

  test("should handle BaseError instances through toJSON", async ({ app }) => {
    const response = await app.inject({ method: "GET", url: "/base" });

    expect(response.statusCode).toBe(401);
    expect(JSON.parse(response.body)).toMatchObject({
      name: "UnauthorisedError",
      message: "Unauthorised. Please log in to continue.",
      status: 401,
    });
  });

  test("should handle validation errors as 400", async ({ app }) => {
    const response = await app.inject({ method: "GET", url: "/zod" });

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({
      name: "ZodError",
      status: 400,
    });
  });

  test("should handle Fastify schema validation failures as 400", async ({
    app,
  }) => {
    const response = await app.inject({
      method: "GET",
      url: "/validation?limit=abc",
    });

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toMatchObject({
      name: "FST_ERR_VALIDATION",
      status: 400,
    });
  });

  test("should handle CentrifugoError as 500", async ({ app }) => {
    const response = await app.inject({ method: "GET", url: "/centrifugo" });

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toMatchObject({
      name: "CentrifugoError",
      message: "publish failed",
      status: 500,
    });
  });

  test("should not leak generic error messages to the client", async ({
    app,
  }) => {
    const response = await app.inject({ method: "GET", url: "/generic" });

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toMatchObject({
      name: "InternalServerError",
      status: 500,
    });
    expect(response.body).not.toContain("super-secret-internal-detail");
  });
});
