import { fromNodeHeaders } from "better-auth/node";
import type { FastifyRequest } from "fastify";

import { UnauthorisedError } from "@/errors";

export async function authenticate(req: FastifyRequest) {
  const session = await req.betterAuth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    throw new UnauthorisedError();
  }

  req.session = session.session;
  req.user = session.user;
}
