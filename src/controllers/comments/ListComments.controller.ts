import { FastifyReply, FastifyRequest } from "fastify";
import { database } from "../../configs/database";

type QueryInput = {
  page: number;
  order: "desc" | "asc";
  postId: number;
};

const LIMIT = 10;

export class ListCommentsController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as QueryInput;

    const comments = await database.comment.findMany({
      where: {
        postId: query.postId,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        likes: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            imageUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: query.order,
      },
      skip: (query.page - 1) * LIMIT,
      take: LIMIT,
    });

    return reply.status(200).send(comments);
  }
}
