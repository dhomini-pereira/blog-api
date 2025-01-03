import { FastifyReply, FastifyRequest } from "fastify";
import { database } from "../../configs/database";

type PostInput = {
  title: string;
  content: string;
  bannerUrl: string;
  flags: string[];
};

export class CreatePostController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const data = request.body as PostInput;
    const userId = request.userId;

    await database.post.create({
      data: {
        title: data.title,
        content: data.content,
        bannerUrl: data.bannerUrl,
        userId,
        flags: {
          connectOrCreate: data.flags.map((flag) => ({
            create: { name: flag.toLowerCase() },
            where: { name: flag.toLowerCase() },
          })),
        },
      },
    });

    return reply.status(201).send();
  }
}
