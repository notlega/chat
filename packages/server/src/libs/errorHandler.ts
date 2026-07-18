import { CentrifugoError } from "@chat/centrifugo";
import { TokenError } from "fast-jwt";
import type {
  FastifyError,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { ZodError } from "zod";

import { BaseError } from "@/errors";

export function errorHandler(
  this: FastifyInstance,
  error: Error,
  _req: FastifyRequest,
  rep: FastifyReply,
) {
  let status = 500;

  if ("code" in error && (error.code as string).startsWith("FST")) {
    status = (error as FastifyError).statusCode || status;

    this.log.error(error);
    rep.status(status).send({
      name: error.code,
      message: error.message,
      status,
    });
    return;
  }

  if (error instanceof TokenError) {
    status = 401;

    this.log.error(error);
    rep.status(status).send({
      name: error.code,
      message: error.message,
      status,
    });
    return;
  }

  if (error instanceof BaseError) {
    this.log.error(error);
    rep.status(error.statusCode).send(error.toJSON());
    return;
  }

  if (error instanceof ZodError) {
    status = 400;

    this.log.error(error);
    rep.status(status).send({
      name: error.name,
      message: error.message,
      status,
    });
    return;
  }

  if (error instanceof CentrifugoError) {
    status = 500;

    this.log.error(error);
    rep.status(status).send({
      name: error.name,
      message: error.message,
      status,
    });
    return;
  }

  this.log.error(error);
  rep.status(status).send({
    name: "InternalServerError",
    message:
      "An unknown internal server error occurred. Please contact the administrator.",
    status,
  });
}
