import { describe, expect } from "vitest";

import { test } from "./libs/utils";

describe("404", () => {
  test("should return 404 for an unknown route", async ({ app }) => {
    const response = await app.inject({
      method: "GET",
      url: "/does-not-exist",
    });

    expect(response.statusCode).toBe(404);
    expect(JSON.parse(response.body)).toMatchObject({
      status: 404,
    });
  });
});
