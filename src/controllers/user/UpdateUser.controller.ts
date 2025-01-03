import { FastifyReply, FastifyRequest } from "fastify";
import { database } from "../../configs/database";

export class UpdateUserController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params as { id: string };
    const body = request.body as {
      name?: string;
      email?: string;
      password?: string;
      imageUrl?: string;
      roles?: number[];
    };

    const userId = request.userId;

    if (userId !== params.id) {
      return reply
        .status(403)
        .send({ error: "Você não pode atualizar este usuário" });
    }

    await database.user.update({
      where: {
        id: params.id,
      },
      data: {
        name: body.name,
        email: body.email,
        imageUrl: body.imageUrl,
        password: body.password,
        roles: {
          connect: body.roles?.map((role) => ({ id: role })),
        },
      },
    });

    return reply.status(204).send();
  }
}
