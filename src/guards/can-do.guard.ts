import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";
import { database } from "../configs/database";

export class CanDoGuard {
  constructor(private permission: string) {
    this.handle = this.handle.bind(this);
  }

  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.userId;

      const user = await database.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          roles: {
            select: {
              permissions: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      if (!user) return reply.status(403).send({ error: "User not found" });

      const hasPermission = user.roles.some((role) =>
        role.permissions.some(
          (permission) => permission.name === this.permission
        )
      );

      if (!hasPermission) {
        return reply.status(403).send({ error: "Permission denied" });
      }
    } catch (error) {
      return reply.status(403).send({ error: "Access denied" });
    }
  }
}
