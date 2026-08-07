import type { FastifyInstance } from "fastify";

export async function checkDB(app: FastifyInstance) {
  await app.db.execute("SELECT 1");
}
