import { index, pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "../helpers";
import { usersTable } from "./users";

export const messagesTable = pgTable(
  "messages",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    ...timestamps,
  },
  (table) => [index().on(table.createdAt)],
);
