import { FastifyReply, FastifyRequest } from "fastify";
import { database } from "../../configs/database";

type QueryInput = {
  page: number;
  order: "asc" | "desc";
  search: string;
};

const LIMIT = 10;

export class ListUsersController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as QueryInput;

    const users = await database.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        password: false,
        roles: {
          select: {
            permissions: false,
            users: false,
            id: true,
            name: true,
            description: true,
          },
        },
      },
      take: LIMIT,
      skip: (query.page - 1) * LIMIT,
      orderBy: {
        name: query.order,
      },
      where: {
        name: {
          contains: query.search,
        },
      },
    });

    return reply.status(200).send(users);
  }
}
