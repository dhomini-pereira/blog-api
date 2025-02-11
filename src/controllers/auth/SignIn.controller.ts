import { FastifyReply, FastifyRequest } from "fastify";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { database } from "../../configs/database";

type SignIn = {
  email: string;
  password: string;
};

export class SignInController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = request.body as SignIn;

      const user = await database.user.findFirst({
        select: {
          id: true,
          email: true,
          name: true,
          imageUrl: true,
          password: false,
          roles: false,
        },
        where: {
          email: data.email,
          password: data.password,
        },
      });

      if (!user)
        return reply.status(403).send({ error: "Invalid credentials" });

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          name: user.name,
          imageUrl: user.imageUrl,
        },
        process.env.TOKEN_ACCESS_KEY as string,
        {
          expiresIn: "30m",
        }
      );

      return reply.status(200).send({ token });
    } catch (err) {
      if (err instanceof JsonWebTokenError) {
        return reply.status(403).send({ error: "Invalid credentials" });
      }
      return reply.status(500).send({ error: "Internal server error" });
    }
  }
}
