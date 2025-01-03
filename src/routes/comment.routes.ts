import { CreateCommentController } from "../controllers/comments/CreateComment.controller";
import { DeleteCommentController } from "../controllers/comments/DeleteComment.controller";
import { GetCommentController } from "../controllers/comments/GetComment.controller";
import { ListCommentsController } from "../controllers/comments/ListComments.controller";
import { UpdateCommentController } from "../controllers/comments/UpdateComment.controller";
import { AuthGuard } from "../guards/auth.guard";
import { FastifyInstance } from "../types";
import { z } from "zod";

export class CommentRoutes {
  static routes(app: FastifyInstance) {
    app.get(
      "/",
      {
        schema: {
          tags: ["comments"],
          description: "List comments",
          querystring: z.object({
            page: z.string().optional().default("1").transform(Number),
            order: z.enum(["desc", "asc"]).optional().default("desc"),
            postId: z.string().transform(Number),
          }),
          response: {
            200: z.array(
              z.object({
                id: z.bigint(),
                content: z.string(),
                createdAt: z.date(),
                updatedAt: z.date(),
                likes: z.bigint(),
                author: z.object({
                  id: z.string(),
                  name: z.string(),
                  email: z.string(),
                  imageUrl: z.string().nullable(),
                }),
              })
            ),
          },
        },
      },
      ListCommentsController.handle
    );

    app.get(
      "/:id",
      {
        schema: {
          tags: ["comments"],
          description: "Get a comment",
          params: z.object({
            id: z.string().transform(Number),
          }),
          response: {
            404: z.object({ error: z.string() }),
            200: z.object({
              id: z.bigint(),
              content: z.string(),
              likes: z.bigint(),
              createdAt: z.date(),
              updatedAt: z.date(),
              author: z.object({
                id: z.string(),
                name: z.string(),
                email: z.string(),
                imageUrl: z.string().nullable(),
              }),
            }),
          },
        },
      },
      GetCommentController.handle
    );

    app.post(
      "/",
      {
        schema: {
          tags: ["comments"],
          description: "Create a new comment",
          headers: z.object({
            authorization: z.string(),
          }),
          body: z.object({
            content: z.string(),
            postId: z.number(),
          }),
          response: {
            201: z.null({ description: "Comment created successfully" }),
          },
        },
        preHandler: [AuthGuard.handle],
      },
      CreateCommentController.handle
    );

    app.put(
      "/:id",
      {
        schema: {
          tags: ["comments"],
          description: "Update a comment",
          headers: z.object({
            authorization: z.string(),
          }),
          params: z.object({
            id: z.string().transform(Number),
          }),
          body: z.object({
            content: z.string().optional(),
            likes: z.number().optional(),
          }),
          response: {
            201: z.null(),
            403: z.object({ error: z.string() }),
            404: z.object({ error: z.string() }),
          },
        },
        preHandler: [AuthGuard.handle],
      },
      UpdateCommentController.handle
    );

    app.delete(
      "/:id",
      {
        schema: {
          tags: ["comments"],
          description: "Delete a comment",
          headers: z.object({
            authorization: z.string(),
          }),
          params: z.object({
            id: z.string().transform(Number),
          }),
          response: {
            404: z.object({ error: z.string() }),
            403: z.object({ error: z.string() }),
            204: z.null(),
          },
        },
        preHandler: [AuthGuard.handle],
      },
      DeleteCommentController.handle
    );
  }
}
