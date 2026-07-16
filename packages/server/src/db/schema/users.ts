import { boolean, pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "../helpers";

export const usersTable = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  phoneNumber: text("phone_number").unique(),
  phoneNumberVerified: boolean("phone_number_verified"),
  isAnonymous: boolean("is_anonymous").default(false),
  image: text("image"),
  ...timestamps,
});
