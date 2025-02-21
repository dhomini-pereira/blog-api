import { FastifyReply, FastifyRequest } from "fastify";
import { database } from "../../configs/database";

export class ListPermissionsController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const permissions = await database.permission.findMany();

    return reply.status(200).send(permissions);
  }
}
