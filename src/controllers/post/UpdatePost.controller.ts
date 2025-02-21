import { FastifyReply, FastifyRequest } from "fastify";
import { database } from "../../configs/database";

export class UpdatePostController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.userId;
    const params = request.params as { id: number };
    const data = request.body as {
      title?: string;
      content?: string;
      bannerUrl?: string;
    };

    const post = await database.post.findUnique({
      select: {
        id: true,
        title: true,
        content: true,
        bannerUrl: true,
        author: {
          select: {
            id: true,
          },
        },
      },
      where: {
        id: params.id,
      },
    });

    if (!post) return reply.status(404).send({ error: "Post não encontrado" });

    if (post.author?.id !== userId)
      return reply.status(403).send({ error: "Este post não pertence a você" });

    await database.post.update({
      where: {
        id: params.id,
      },
      data: {
        title: data.title,
        content: data.content,
        bannerUrl: data.bannerUrl,
      },
    });

    return reply.status(204).send();
  }
}
