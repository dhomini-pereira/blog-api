import { FastifyReply, FastifyRequest } from "fastify";
import { database } from "../../configs/database";

type Params = {
  id: number;
};

export class LikeController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.userId;
    const params = request.params as Params;

    const like = await database.like.findFirst({
      where: {
        postId: params.id,
        userId,
      },
    });

    if (like) {
      await database.like.deleteMany({
        where: {
          postId: params.id,
          userId,
        },
      });
    } else {
      await database.like.create({
        data: {
          userId: userId,
          postId: params.id,
        },
      });
    }

    return reply.status(204).send();
  }
}
