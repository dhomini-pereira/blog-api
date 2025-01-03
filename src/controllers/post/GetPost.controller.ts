import { FastifyReply, FastifyRequest } from "fastify";
import { database } from "../../configs/database";

export class GetPostController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params as { id: number };

    const post = await database.post.findUnique({
      select: {
        id: true,
        title: true,
        content: true,
        likes: true,
        bannerUrl: true,
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
        flags: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      where: {
        id: params.id,
      },
    });

    if (!post) return reply.status(404).send({ error: "Post não encontrado" });

    return reply.status(200).send(post);
  }
}
