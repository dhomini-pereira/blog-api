import { FastifyReply, FastifyRequest } from "fastify";
import { database } from "../../configs/database";

type Params = {
  id: number;
};

export class DeleteNotification {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.userId;
    const { id } = request.params as Params;

    const notification = await database.notification.findUnique({
      where: {
        id,
      },
    });

    if (!notification) {
      return reply.status(404).send({ error: "Notificação não encontrada" });
    }

    if (notification.userId !== userId) {
      return reply
        .status(403)
        .send({ error: "Você não pode deletar uma notificação que não é sua" });
    }

    await database.notification.delete({
      where: {
        id,
        userId,
      },
    });

    return reply.status(204).send();
  }
}
