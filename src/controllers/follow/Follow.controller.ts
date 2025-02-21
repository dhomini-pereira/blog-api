import { FastifyReply, FastifyRequest } from "fastify";
import { database } from "../../configs/database";

type Params = {
  id: string;
};

export class FollowController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.userId;
    const { id: followedId } = request.params as Params;

    const follow = await database.follow.findFirst({
      where: {
        followerId: followedId,
        followingId: userId,
      },
    });

    if (follow) {
      await database.follow.deleteMany({
        where: {
          followerId: followedId,
          followingId: userId,
        },
      });
    } else {
      await database.follow.create({
        data: {
          followerId: followedId,
          followingId: userId,
        },
      });
    }

    return reply.status(204).send();
  }
}
