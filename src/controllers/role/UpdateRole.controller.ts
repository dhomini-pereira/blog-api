import { FastifyReply, FastifyRequest } from "fastify";
import { database } from "../../configs/database";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export class UpdateRoleController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const params = request.params as { id: number };
      const data = request.body as {
        name?: string;
        description?: string;
        permissions?: number[];
      };

      const role = await database.role.findFirst({
        where: {
          id: params.id,
        },
      });

      if (!role) return reply.status(404).send({ error: "Role not found" });

      await database.role.update({
        where: {
          id: params.id,
        },
        data: {
          name: data.name,
          description: data.description,
          permissions: {
            set: data.permissions?.map((id) => ({ id })) ?? [],
          },
        },
      });

      return reply.status(204).send();
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
