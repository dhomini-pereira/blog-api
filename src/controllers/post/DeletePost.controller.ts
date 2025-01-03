import { FastifyReply, FastifyRequest } from "fastify";
import { database } from "../../configs/database";

export class DeletePostController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params as { id: number };

    const post = await database.post.findUnique({
      where: {
        id: params.id,
      },
      select: {
        author: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!post) return reply.status(404).send({ error: "Post não encontrado" });

    if (post.author?.id !== request.userId)
      return reply.status(403).send({ error: "Este post não pertence a você" });

    await database.post.delete({
      where: {
        id: params.id,
      },
    });

    return reply.status(204).send();
  }
}
