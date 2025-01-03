import { FastifyReply, FastifyRequest } from "fastify";
import { database } from "../../configs/database";

export class DeleteCommentController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.userId;
    const params = request.params as { id: number };

    const comment = await database.comment.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!comment)
      return reply.status(404).send({ error: "Comentário não existente" });

    if (comment.userId !== userId)
      return reply
        .status(403)
        .send({ error: "Este comentário não pertence à você" });

    await database.comment.delete({
      where: {
        id: params.id,
      },
    });

    return reply.status(204).send();
  }
}
