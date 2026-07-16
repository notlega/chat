import { defineRelations } from "drizzle-orm";

import {
  accountsTable,
  messagesTable,
  sessionsTable,
  usersTable,
} from "./schema";

export const relations = defineRelations(
  {
    usersTable,
    sessionsTable,
    accountsTable,
    messagesTable,
  },
  (relations) => ({
    usersTable: {
      sessionsTable: relations.many.sessionsTable({
        alias: "sessionsUser",
      }),
      accountsTable: relations.many.accountsTable({
        alias: "accountsUser",
      }),
      messagesTable: relations.many.messagesTable({
        alias: "messagesUser",
      }),
    },
    sessionsTable: {
      user: relations.one.usersTable({
        alias: "sessionsUser",
        from: relations.sessionsTable.userId,
        to: relations.usersTable.id,
        optional: false,
      }),
    },
    accountsTable: {
      user: relations.one.usersTable({
        alias: "accountsUser",
        from: relations.accountsTable.userId,
        to: relations.usersTable.id,
        optional: false,
      }),
    },
    messagesTable: {
      user: relations.one.usersTable({
        alias: "messagesUser",
        from: relations.messagesTable.userId,
        to: relations.usersTable.id,
        optional: false,
      }),
    },
  }),
);
