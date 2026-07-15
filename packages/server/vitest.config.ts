import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@chat/contracts": fileURLToPath(
        new URL(
          "./node_modules/@chat/contracts/dist/index.mjs",
          import.meta.url,
        ),
      ),
      "better-auth/test-utils": fileURLToPath(
        new URL(
          "./node_modules/better-auth/dist/test-utils/index.mjs",
          import.meta.url,
        ),
      ),
    },
  },
  test: {
    environment: "node",
    passWithNoTests: true,
    setupFiles: ["./__tests__/setup.ts"],
    env: { NODE_ENV: "test" },
    coverage: {
      provider: "v8",
      include: ["src/**"],
      exclude: [
        "src/app.ts",
        "src/server.ts",
        "src/plugins/**",
        "src/modules/**/*.repository.ts",
        "src/db/**",
      ],
    },
  },
});
