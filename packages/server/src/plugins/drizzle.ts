import fastifyPlugin from "fastify-plugin";
import { db, pool } from "../db";

export const drizzlePlugin = fastifyPlugin(async (fastify) => {
  fastify.decorate("db", db);

  fastify.addHook("onClose", async () => {
    await pool.end();
  });
});
