import { FastifyReply, FastifyRequest } from "fastify";
import { JsonWebTokenError, verify } from "jsonwebtoken";
import { database } from "../../configs/database";

type TokenData = {
  id: string;
  email: string;
  name: string;
  imageUrl: string;
};

export class GetUserInfoController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const token = request.headers.authorization as string;

      const tokenData = verify(
        token,
        process.env.TOKEN_ACCESS_KEY as string
      ) as TokenData;

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
          id: tokenData.id,
          email: tokenData.email,
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
