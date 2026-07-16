import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { timestamps } from "../helpers";

export const jwkssTable = pgTable("jwkss", {
  id: text("id").primaryKey(),
  publicKey: text("public_key").notNull(),
  privateKey: text("private_key").notNull(),
  expiresAt: timestamp("expires_at"),
  ...timestamps,
});
