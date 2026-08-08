import type { FastifyInstance } from "fastify";
import { test as baseTest } from "vitest";

import { buildApp } from "@/app";

import { createTestAuth } from "./createTestAuth";

export const test = baseTest.extend("app", async ({}, { onCleanup }) => {
  const { auth } = await createTestAuth();

  const app = buildApp({ betterAuth: auth });
  await app.ready();

  onCleanup(async () => await app.close());

  return app;
});

export async function signInAnonymous(app: FastifyInstance) {
  const response = await app.inject({
    method: "POST",
    url: "/auth/sign-in/anonymous",
  });

  if (response.statusCode !== 200) {
    throw new Error(`anonymous sign-in failed: ${response.statusCode}`);
  }

  return response.cookies
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
}

export async function getCsrfToken(
  app: FastifyInstance,
  sessionCookie: string,
) {
  const response = await app.inject({
    method: "GET",
    url: "/auth/csrf-token",
    headers: { cookie: sessionCookie },
  });

  if (response.statusCode !== 200) {
    throw new Error(
      `csrf token request failed: ${response.statusCode}: ${response.body}`,
    );
  }

  const { csrfToken } = response.json() as { csrfToken: string };
  const csrfCookie = response.cookies
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  return {
    token: csrfToken,
    cookie: [sessionCookie, csrfCookie].filter(Boolean).join("; "),
  };
}
