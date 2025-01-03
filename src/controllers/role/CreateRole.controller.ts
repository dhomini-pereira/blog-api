import { FastifyReply, FastifyRequest } from "fastify";
import { database } from "../../configs/database";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

type RoleInput = {
  name: string;
  description: string;
  permissions: number[];
};

export class CreateRoleController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = request.body as RoleInput;

      await database.role.create({
        data: {
          name: data.name,
          description: data.description,
          permissions: {
            connect: data.permissions.map((id) => ({ id })),
          },
        },
      });

      return reply.status(201).send();
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          return reply.status(400).send({ error: "Role already exists" });
        }
      }

      return reply.status(500).send({ error: "Internal server error" });
    }
  }
}
