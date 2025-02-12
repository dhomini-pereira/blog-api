import "./types";
import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import {
  validatorCompiler,
  serializerCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { UserRoutes } from "./routes/user.routes";
import { AuthRoutes } from "./routes/auth.routes";
import { PostRoutes } from "./routes/post.routes";
import { CommentRoutes } from "./routes/comment.routes";
import { RoleRoutes } from "./routes/role.routes";
import { PermissionRoutes } from "./routes/permision.routes";
import AWSLambda from "@fastify/aws-lambda";

export const handler = AWSLambda(
  (() => {
    const app = fastify().withTypeProvider<ZodTypeProvider>();

    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);

    app.register(fastifyCors, { origin: "*" });

    app.register(UserRoutes.routes, {
      prefix: "/api/user",
    });

    app.register(AuthRoutes.routes, {
      prefix: "/api/auth",
    });

    app.register(PostRoutes.routes, {
      prefix: "/api/post",
    });

    app.register(CommentRoutes.routes, {
      prefix: "/api/comment",
    });

    app.register(RoleRoutes.routes, {
      prefix: "/api/role",
    });

    app.register(PermissionRoutes.routes, {
      prefix: "/api/permission",
    });

    return app;
  })()
);
