import { FastifyReply, FastifyRequest } from "fastify";
import { database } from "../../configs/database";

const LIMIT = 10;

type QueryParams = {
  page: number;
  order: "desc" | "asc";
  search: string;
  flag: string;
};

export class ListPostsController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const queryParams = request.query as QueryParams;

    const page = queryParams.page;
    const order = queryParams.order;

    const [posts, total] = await Promise.all([
      database.post.findMany({
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
          OR: [
            {
              title: {
                contains: queryParams.search,
                mode: "insensitive",
              },
              flags: {
                some: {
                  name: queryParams.flag,
                },
              },
            },
            {
              content: {
                contains: queryParams.search,
                mode: "insensitive",
              },
              flags: {
                some: {
                  name: queryParams.flag,
                },
              },
            },
          ],
        },
        orderBy: {
          createdAt: order,
        },
        take: LIMIT,
        skip: (page - 1) * LIMIT,
      }),
      database.post.count({
        where: {
          OR: [
            {
              title: {
                contains: queryParams.search,
                mode: "insensitive",
              },
              flags: {
                some: {
                  name: queryParams.flag,
                },
              },
            },
            {
              content: {
                contains: queryParams.search,
                mode: "insensitive",
              },
              flags: {
                some: {
                  name: queryParams.flag,
                },
              },
            },
          ],
        },
        orderBy: {
          createdAt: order,
        },
        take: LIMIT,
        skip: (page - 1) * LIMIT,
      }),
    ]);

    return reply.status(200).send({ total, posts });
  }
}
