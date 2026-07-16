import { timestamp } from "drizzle-orm/pg-core";

export const timestamps = {
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
};

export const timestampsWithDeletedAt = {
  ...timestamps,
  deletedAt: timestamp(),
};
