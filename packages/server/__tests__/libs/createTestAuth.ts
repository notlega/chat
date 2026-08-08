import { anonymous } from "better-auth/plugins";
import { getTestInstance } from "better-auth/test-utils";
import { nanoid } from "nanoid";

export function createTestAuth() {
  return getTestInstance({
    basePath: "/auth",
    trustedOrigins: [process.env.CLIENT_URL],
    plugins: [anonymous({ generateName: () => `test-user-${nanoid(8)}` })],
  });
}
