import { FastifyReply, FastifyRequest } from "fastify";
import { JsonWebTokenError } from "jsonwebtoken";
import { database } from "../../configs/database";

export class GetUserInfoController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.userId;

      const user = await database.user.findUnique({
        select: {
          id: true,
          name: true,
          email: true,
          imageUrl: true,
          createdAt: true,
          updatedAt: true,
        },
        where: {
          id: userId,
        },
      });

      return reply.status(200).send(user);
    } catch (err: any) {
      if (err instanceof JsonWebTokenError) {
        return reply.status(403).send({ error: "Invalid credentials" });
      }

      return reply.status(500).send({ error: "Internal server error" });
    }
  }
}
