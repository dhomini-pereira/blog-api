import { FastifyReply, FastifyRequest } from "fastify";
import { database } from "../../configs/database";

type Query = {
  page: number;
};

export class ListChatsController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.userId;
    const query = request.query as Query;

    const chats = await database.chat.findMany({
      where: {
        participants: {
          some: { userId },
        },
      },
      select: {
        id: true,
        isGroup: true,
        name: true,
        messages: {
          select: {
            createdAt: true,
            content: true,
            author: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        participants: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              },
            },
          },
          where: {
            userId: { not: userId },
          },
          take: 1,
        },
      },
    });

    const orderedChats = chats.sort((a, b) => {
      const dateA = a.messages[0]?.createdAt || new Date(0);
      const dateB = b.messages[0]?.createdAt || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });

    return reply.status(200).send({ chats: orderedChats });
  }
}
