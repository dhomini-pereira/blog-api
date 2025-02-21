import { GetPermissionController } from "../controllers/permission/GetPermission.controller";
import { ListPermissionsController } from "../controllers/permission/ListPermissions.controller";
import { AuthGuard } from "../guards/auth.guard";
import { CanDoGuard } from "../guards/can-do.guard";
import { FastifyInstance } from "../types";
import { z } from "zod";

export class PermissionRoutes {
  static routes(app: FastifyInstance) {
    app.get(
      "/",
      {
        schema: {
          tags: ["permissions"],
          description: "List permissions",
          headers: z.object({
            authorization: z.string(),
          }),
          response: {
            200: z.array(
              z.object({
                id: z.number(),
                name: z.string(),
                description: z.string(),
              })
            ),
          },
        },
        preHandler: [
          AuthGuard.handle,
          new CanDoGuard("LIST_PERMISSIONS").handle,
        ],
      },
      ListPermissionsController.handle
    );

    app.get(
      "/:id",
      {
        schema: {
          tags: ["permissions"],
          description: "Get a permission",
          headers: z.object({
            authorization: z.string(),
          }),
          params: z.object({
            id: z.string().transform(Number),
          }),
          response: {
            200: z.object({
              id: z.number(),
              name: z.string(),
              description: z.string(),
            }),
            404: z.object({ error: z.string() }),
          },
        },
        preHandler: [AuthGuard.handle, new CanDoGuard("GET_PERMISSION").handle],
      },
      GetPermissionController.handle
    );
  }
}
