import { z } from "zod";
import { ListRolesController } from "../controllers/role/ListRoles.controller";
import { AuthGuard } from "../guards/auth.guard";
import { CanDoGuard } from "../guards/can-do.guard";
import { FastifyInstance } from "../types";
import { GetRoleController } from "../controllers/role/GetRole.controller";
import { CreateRoleController } from "../controllers/role/CreateRole.controller";
import { DeleteRoleController } from "../controllers/role/DeleteRole.controller";
import { UpdateRoleController } from "../controllers/role/UpdateRole.controller";

export class RoleRoutes {
  static routes(app: FastifyInstance) {
    app.get(
      "/",
      {
        schema: {
          tags: ["roles"],
          description: "List roles",
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
                id: z.number(),
                name: z.string(),
                description: z.string(),
                createdAt: z.date(),
                updatedAt: z.date(),
              })
            ),
          },
        },
        preHandler: [AuthGuard.handle, new CanDoGuard("LIST_ROLES").handle],
      },
      ListRolesController.handle
    );

    app.get(
      "/:id",
      {
        schema: {
          tags: ["roles"],
          description: "Get a role",
          params: z.object({
            id: z.string().transform(Number),
          }),
          response: {
            200: z.object({
              id: z.number(),
              name: z.string(),
              description: z.string(),
              createdAt: z.date(),
              updatedAt: z.date(),
              permissions: z.array(
                z.object({
                  id: z.number(),
                  name: z.string(),
                  description: z.string(),
                })
              ),
            }),
            404: z.object({ error: z.string() }),
          },
        },
        preHandler: [AuthGuard.handle, new CanDoGuard("GET_ROLE").handle],
      },
      GetRoleController.handle
    );

    app.post(
      "/",
      {
        schema: {
          tags: ["roles"],
          description: "Create a new role",
          headers: z.object({
            authorization: z.string(),
          }),
          body: z.object({
            name: z.string(),
            description: z.string(),
            permissions: z.array(z.number()),
          }),
          response: {
            201: z.null({ description: "Role created successfully" }),
            400: z.object({ error: z.string() }),
          },
        },
        preHandler: [AuthGuard.handle, new CanDoGuard("CREATE_ROLE").handle],
      },
      CreateRoleController.handle
    );

    app.delete(
      "/:id",
      {
        schema: {
          tags: ["roles"],
          description: "Delete a role",
          headers: z.object({
            authorization: z.string(),
          }),
          params: z.object({
            id: z.string().transform(Number),
          }),
          response: {
            204: z.null({ description: "Role deleted successfully" }),
            404: z.object({ error: z.string() }),
            403: z.object({ error: z.string() }),
          },
        },
        preHandler: [AuthGuard.handle, new CanDoGuard("DELETE_ROLE").handle],
      },
      DeleteRoleController.handle
    );

    app.put(
      "/:id",
      {
        schema: {
          tags: ["roles"],
          description: "Update a role",
          headers: z.object({
            authorization: z.string(),
          }),
          params: z.object({
            id: z.string().transform(Number),
          }),
          body: z.object({
            name: z.string().optional(),
            description: z.string().optional(),
            permissions: z.array(z.number()).optional(),
          }),
          response: {
            204: z.null({ description: "Role updated successfully" }),
            404: z.object({ error: z.string() }),
            403: z.object({ error: z.string() }),
            500: z.object({ error: z.string() }),
          },
        },
        preHandler: [AuthGuard.handle, new CanDoGuard("UPDATE_ROLE").handle],
      },
      UpdateRoleController.handle
    );
  }
}
