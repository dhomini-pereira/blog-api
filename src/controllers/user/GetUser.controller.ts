import { FastifyReply, FastifyRequest } from "fastify";
import { database } from "../../configs/database";

export class GetUserController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params as { id: string };

    const user = await database.user.findUnique({
      select: {
        id: true,
        email: false,
        name: true,
        password: false,
        imageUrl: true,
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
      where: {
        id: params.id,
      },
    });

    if (!user) return reply.status(404).send({ error: "User not found" });

    return reply.status(200).send(user);
  }
}
