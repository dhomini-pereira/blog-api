import { DeleteNotification } from "../controllers/notification/DeleteNotification.controller";
import { ListNotificationsController } from "../controllers/notification/ListNotifications.controller";
import { AuthGuard } from "../guards/auth.guard";
import { FastifyInstance } from "../types";
import { z } from "zod";

export class NotificationRoutes {
  static routes(app: FastifyInstance) {
    app.get(
      "/",
      {
        schema: {
          querystring: z.object({
            page: z.string().optional().default("1").transform(Number),
          }),
          response: {
            200: z.object({
              total: z.number(),
              notifications: z.object({
                id: z.bigint(),
                content: z.string(),
                navigation: z.string(),
                createdAt: z.date(),
              }),
            }),
          },
        },
        preHandler: [AuthGuard.handle],
      },
      ListNotificationsController.handle
    );

    app.delete(
      "/:id",
      {
        schema: {
          params: z.object({
            id: z.string().transform(Number),
          }),
          response: {
            204: z.null(),
            404: z.object({ error: z.string() }),
            403: z.object({ error: z.string() }),
          },
        },
        preHandler: [AuthGuard.handle],
      },
      DeleteNotification.handle
    );
  }
}
