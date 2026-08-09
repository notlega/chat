import * as z from "zod";
import type { routes } from "./router";

const envSchema = z.object({
  VITE_SERVER_URL: z.string(),
  VITE_CENTRIFUGO_URL: z.string(),
});

declare global {
  namespace NodeJS {
    type NODE_ENV = "development" | "test" | "production";
    interface ProcessEnv extends z.infer<typeof envSchema> {
      NODE_ENV: NODE_ENV;
    }
  }
}

declare module "@typeroute/router" {
  interface Register {
    routes: typeof routes;
  }
}
