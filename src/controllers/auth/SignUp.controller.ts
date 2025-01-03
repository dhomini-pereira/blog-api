import { FastifyReply, FastifyRequest } from "fastify";
import { database } from "../../configs/database";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

type User = {
  name: string;
  email: string;
  password: string;
  imageUrl?: string;
};

export class SignUpController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = request.body as User;

      await database.user.create({
        data: user,
      });

      return reply.status(201).send();
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2002")
          return reply.status(400).send({ error: "E-Mail already exists" });
      }

      return reply.status(500).send({ error: "Internal server error" });
    }
  }
}
