import { FastifyReply, FastifyRequest } from "fastify";
import { database } from "../../configs/database";

export class DeleteRoleController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params as { id: number };

    const role = await database.role.findFirst({
      where: {
        id: params.id,
      },
    });

    if (!role) return reply.status(404).send({ error: "Role not found" });

    await database.role.delete({
      where: {
        id: params.id,
      },
    });

    return reply.status(204).send();
  }
}
