import { FastifyReply, FastifyRequest } from "fastify";
import { database } from "../../configs/database";

export class GetPermissionController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: number };

    const permission = await database.permission.findUnique({
      where: {
        id,
      },
    });

    if (!permission)
      return reply.status(404).send({ error: "Permission not found" });

    return reply.status(200).send(permission);
  }
}
