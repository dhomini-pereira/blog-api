import { FastifyReply, FastifyRequest } from "fastify";
import { database } from "../../configs/database";

export class GetRoleController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params as { id: number };

    const role = await database.role.findFirst({
      where: {
        id: params.id,
      },
      include: {
        permissions: true,
        users: false,
      },
    });

    if (!role) return reply.status(404).send({ error: "Role not found" });

    return reply.status(200).send(role);
  }
}
