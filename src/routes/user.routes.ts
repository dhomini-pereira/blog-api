import { z } from "zod";
import { FastifyInstance } from "../types";
import { ListUsersController } from "../controllers/user/ListUsers.controller";
import { AuthGuard } from "../guards/auth.guard";
import { CanDoGuard } from "../guards/can-do.guard";
import { GetUserController } from "../controllers/user/GetUser.controller";
import { DeleteUserController } from "../controllers/user/DeleteUser.controller";
import { UpdateUserController } from "../controllers/user/UpdateUser.controller";

export class UserRoutes {
  static routes(app: FastifyInstance) {
    app.get(
      "/",
      {
        schema: {
          tags: ["users"],
          description: "List users",
          headers: z.object({
            authorization: z.string(),
          }),
          querystring: z.object({
            page: z.string().optional().default("1").transform(Number),
            order: z.enum(["desc", "asc"]).optional().default("desc"),
            search: z.string().optional().default(""),
          }),
          response: {
            200: z.array(
              z.object({
                id: z.string(),
                email: z.string(),
                name: z.string(),
                roles: z.array(
                  z.object({
                    id: z.number(),
                    name: z.string(),
                    description: z.string(),
                  })
                ),
              })
            ),
          },
        },
        preHandler: [AuthGuard.handle, new CanDoGuard("LIST_USERS").handle],
      },
      ListUsersController.handle
    );

    app.get(
      "/:id",
      {
        schema: {
          tags: ["users"],
          description: "Get a user",
          params: z.object({
            id: z.string().transform(Number),
          }),
          response: {
            200: z.object({
              id: z.string(),
              email: z.string(),
              name: z.string(),
              imageUrl: z.string().nullable(),
              roles: z.array(
                z.object({
                  id: z.number(),
                  name: z.string(),
                  description: z.string(),
                })
              ),
            }),
            404: z.object({
              error: z.string(),
            }),
          },
        },
      },
      GetUserController.handle
    );

    app.delete(
      "/:id",
      {
        schema: {
          tags: ["users"],
          description: "Delete a user",
          headers: z.object({
            authorization: z.string(),
          }),
          params: z.object({
            id: z.string().transform(Number),
          }),
          response: {
            204: z.null({ description: "User deleted successfully" }),
            404: z.object({ error: z.string() }),
            403: z.object({ error: z.string() }),
          },
        },
        preHandler: [AuthGuard.handle],
      },
      DeleteUserController.handle
    );

    app.put(
      "/",
      {
        schema: {
          tags: ["users"],
          description: "Update a user",
          headers: z.object({
            authorization: z.string(),
          }),
          body: z.object({
            name: z.string().optional(),
            email: z.string().email().optional(),
            password: z.string().optional(),
            imageUrl: z.string().optional(),
            roles: z.array(z.number()).optional(),
          }),
          response: {
            204: z.null({ description: "User updated successfully" }),
            404: z.object({ error: z.string() }),
            403: z.object({ error: z.string() }),
          },
        },
        preHandler: [AuthGuard.handle],
      },
      UpdateUserController.handle
    );
  }
}
