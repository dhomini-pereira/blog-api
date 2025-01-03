import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

type User = {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
};

export class AuthGuard {
  static handle(
    request: FastifyRequest,
    reply: FastifyReply,
    done: (error?: Error) => void
  ) {
    try {
      const authorization = request.headers.authorization;

      if (!authorization) return reply.status(401).send();

      if (!authorization.startsWith("Bearer ")) return reply.status(401).send();

      const token = authorization.replace("Bearer ", "");

      const user = jwt.verify(
        token,
        process.env.TOKEN_ACCESS_KEY as string
      ) as User;

      request.userId = user.id;

      return done();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return reply.status(401).send({ error: "Invalid token" });
      }

      if (error instanceof jwt.TokenExpiredError) {
        return reply.status(401).send({ error: "Token expired" });
      }
      return reply.status(401).send({ error: "Unauthorized" });
    }
  }
}
