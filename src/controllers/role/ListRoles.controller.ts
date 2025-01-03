import { FastifyReply, FastifyRequest } from "fastify";
import { database } from "../../configs/database";

type QueryInput = {
  page: number;
  order: "asc" | "desc";
  search: string;
};

const LIMIT = 10;

export class ListRolesController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as QueryInput;

    const roles = await database.role.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        permissions: false,
        users: false,
      },
      orderBy: { name: query.order },
      take: LIMIT,
      skip: (query.page - 1) * LIMIT,
      where: {
        OR: [
          {
            name: {
              contains: query.search,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: query.search,
              mode: "insensitive",
            },
          },
        ],
      },
    });

    return reply.status(200).send(roles);
  }
}
