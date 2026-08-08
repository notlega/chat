import { describe, expect } from "vitest";

import { signInAnonymous, test } from "./libs/utils";

describe("POST /auth/sign-in/anonymous", () => {
  test("should return a session cookie", async ({ app }) => {
    const response = await app.inject({
      method: "POST",
      url: "/auth/sign-in/anonymous",
    });

    expect(response.statusCode).toBe(200);
    expect(
      response.cookies.some(
        (cookie) => cookie.name === "better-auth.session_token",
      ),
    ).toBe(true);
  });
});

describe("GET /auth/csrf-token", () => {
  test("should return 401 when the user is not authenticated", async ({
    app,
  }) => {
    const response = await app.inject({
      method: "GET",
      url: "/auth/csrf-token",
    });

    expect(response.statusCode).toBe(401);
  });

  test("should return a CSRF token for an authenticated user", async ({
    app,
  }) => {
    const sessionCookie = await signInAnonymous(app);

    const response = await app.inject({
      method: "GET",
      url: "/auth/csrf-token",
      headers: { cookie: sessionCookie },
    });

    expect(response.statusCode).toBe(200);

    const { csrfToken } = JSON.parse(response.body) as { csrfToken: string };
    expect(typeof csrfToken).toBe("string");
    expect(csrfToken.length).toBeGreaterThan(0);
  });
});
