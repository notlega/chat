import type { drizzle } from "drizzle-orm/node-postgres";
import type { relations } from "@/db/relations";

export type database = ReturnType<typeof drizzle<typeof relations>>;
