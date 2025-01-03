import { FastifyReply, FastifyRequest } from "fastify";
import { database } from "../../configs/database";

export class DeleteUserController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params as { id: string };
    const userId = request.userId;

    if (userId !== params.id) {
      return reply
        .status(403)
        .send({ error: "Você não pode deletar este usuário" });
    }

    const user = await database.user.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!user) return reply.status(404).send({ error: "User not found" });

    await database.user.delete({
      where: {
        id: params.id,
      },
    });

    return reply.status(204).send();
  }
}
