import { FastifyReply, FastifyRequest } from "fastify";
import { database } from "../../configs/database";

type CommentInput = {
  content: string;
  likes: number;
};

export class UpdateCommentController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.userId;
    const params = request.params as { id: number };
    const data = request.body as CommentInput;

    const comment = await database.comment.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!comment)
      return reply.status(404).send({ error: "Comentário não existente" });

    if (comment.userId !== userId)
      return reply
        .status(403)
        .send({ error: "Este comentário não pertence à você" });

    await database.comment.update({
      where: {
        id: params.id,
      },
      data: {
        content: data.content,
        likes: data.likes,
      },
    });
    return reply.status(201).send();
  }
}
