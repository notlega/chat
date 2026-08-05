import type { FastifyRequest } from "fastify";

export function csrfUserInfo(req: FastifyRequest) {
  return (req.user as { id?: string } | undefined)?.id ?? "";
}
