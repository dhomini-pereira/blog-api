import { FastifyReply, FastifyRequest } from "fastify";
import { database } from "../../configs/database";

export class GetCommentController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params as { id: number };

    const comment = await database.comment.findUnique({
      select: {
        id: true,
        content: true,
        likes: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            imageUrl: true,
          },
        },
      },
      where: {
        id: params.id,
      },
    });

    if (!comment)
      return reply.status(404).send({ error: "Comentário não existente" });

    return reply.status(200).send(comment);
  }
}
