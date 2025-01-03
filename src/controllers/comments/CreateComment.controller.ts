import { FastifyReply, FastifyRequest } from "fastify";
import { database } from "../../configs/database";

type CommentInput = {
  content: string;
  postId: number;
};

export class CreateCommentController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.userId;
    const data = request.body as CommentInput;

    await database.comment.create({
      data: {
        content: data.content,
        postId: data.postId,
        userId: userId,
      },
    });

    return reply.status(201).send();
  }
}
