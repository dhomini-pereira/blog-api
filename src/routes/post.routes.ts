import { z } from "zod";
import { CreatePostController } from "../controllers/post/CreatePost.controller";
import { FastifyInstance } from "../types";
import { AuthGuard } from "../guards/auth.guard";
import { CanDoGuard } from "../guards/can-do.guard";
import { DeletePostController } from "../controllers/post/DeletePost.controller";
import { GetPostController } from "../controllers/post/GetPost.controller";
import { ListPostsController } from "../controllers/post/ListPosts.controller";
import { UpdatePostController } from "../controllers/post/UpdatePost.controller";
import { LikeController } from "../controllers/like/Like.controller";

export class PostRoutes {
  static routes(app: FastifyInstance) {
    app.post(
      "/",
      {
        schema: {
          tags: ["posts"],
          description: "Create a new post",
          headers: z.object({
            authorization: z.string(),
          }),
          body: z.object({
            title: z.string(),
            content: z.string(),
            bannerUrl: z.string(),
            flags: z.array(z.string()),
          }),
          response: {
            201: z.null({ description: "Post created successfully" }),
          },
        },
        preHandler: [AuthGuard.handle, new CanDoGuard("CREATE_POST").handle],
      },
      CreatePostController.handle
    );

    app.delete(
      "/:id",
      {
        schema: {
          tags: ["posts"],
          description: "Delete a post",
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
      DeletePostController.handle
    );

    app.get(
      "/:id",
      {
        schema: {
          tags: ["posts"],
          description: "Get a post",
          headers: z.object({
            authorization: z.string(),
          }),
          params: z.object({
            id: z.string().transform(Number),
          }),
          response: {
            404: z.object({ error: z.string() }),
            200: z.object({
              id: z.bigint(),
              title: z.string(),
              content: z.string(),
              bannerUrl: z.string(),
              likes: z.number(),
              liked: z.boolean(),
              createdAt: z.date(),
              updatedAt: z.date(),
              author: z.object({
                id: z.string(),
                name: z.string(),
                imageUrl: z.string().nullable(),
              }),
              flags: z.array(
                z.object({
                  id: z.bigint(),
                  name: z.string(),
                })
              ),
            }),
          },
        },
        preHandler: [AuthGuard.handle],
      },
      GetPostController.handle
    );

    app.get(
      "/",
      {
        schema: {
          tags: ["posts"],
          description: "List posts",
          headers: z.object({
            authorization: z.string(),
          }),
          querystring: z.object({
            page: z.string().optional().default("1").transform(Number),
            order: z.enum(["desc", "asc"]).optional().default("desc"),
            search: z.string().optional(),
            flag: z.string().optional(),
          }),
          response: {
            200: z.object({
              total: z.number(),
              posts: z.array(
                z.object({
                  id: z.bigint(),
                  title: z.string(),
                  content: z.string(),
                  liked: z.boolean(),
                  likes: z.number(),
                  bannerUrl: z.string(),
                  createdAt: z.date(),
                  updatedAt: z.date(),
                  author: z.object({
                    id: z.string(),
                    name: z.string(),
                    imageUrl: z.string().nullable(),
                  }),
                  flags: z.array(
                    z.object({
                      id: z.bigint(),
                      name: z.string(),
                    })
                  ),
                })
              ),
            }),
          },
        },
        preHandler: [AuthGuard.handle],
      },
      ListPostsController.handle
    );

    app.put(
      "/:id",
      {
        schema: {
          tags: ["posts"],
          description: "Update a post",
          headers: z.object({
            authorization: z.string(),
          }),
          params: z.object({
            id: z.string().transform(Number),
          }),
          body: z.object({
            title: z.string().optional(),
            content: z.string().optional(),
          }),
          response: {
            204: z.null(),
            403: z.object({ error: z.string() }),
            404: z.object({ error: z.string() }),
          },
        },
        preHandler: [AuthGuard.handle],
      },
      UpdatePostController.handle
    );

    app.put(
      "/:id/like",
      {
        schema: {
          tags: ["posts"],
          description: "Like a post",
          headers: z.object({
            authorization: z.string(),
          }),
          params: z.object({
            id: z.string().transform(Number),
          }),
          response: {
            204: z.null(),
          },
        },
        preHandler: [AuthGuard.handle],
      },
      LikeController.handle
    );
  }
}
