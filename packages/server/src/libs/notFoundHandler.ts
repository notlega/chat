import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export function notFoundHandler(
  this: FastifyInstance,
  req: FastifyRequest,
  rep: FastifyReply,
) {
  rep.status(404).send({
    message: `Invalid route: ${req.method} ${req.url}`,
    status: 404,
  });
}
