import { FastifyReply, FastifyRequest } from "fastify";
import { database } from "../../configs/database";

type Query = {
  page: number;
};

const LIMIT = 10;

export class ListNotificationsController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as Query;
    const userId = request.userId;

    const notificationsP = database.notification.findMany({
      select: {
        id: true,
        content: true,
        createdAt: true,
        navigation: true,
        userId: false,
        user: false,
      },
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (query.page - 1) * LIMIT,
      take: LIMIT,
    });

    const totalP = database.notification.count({
      where: { userId },
    });

    const [notifications, total] = await Promise.all([notificationsP, totalP]);

    return reply.status(200).send({ total, notifications });
  }
}
