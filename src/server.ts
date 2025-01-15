import "./types";
import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import {
  validatorCompiler,
  serializerCompiler,
  ZodTypeProvider,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { UserRoutes } from "./routes/user.routes";
import { AuthRoutes } from "./routes/auth.routes";
import { PostRoutes } from "./routes/post.routes";
import { CommentRoutes } from "./routes/comment.routes";
import { RoleRoutes } from "./routes/role.routes";
import AWSLambda from "@fastify/aws-lambda";
import { PermissionRoutes } from "./routes/permision.routes";

export const handler = AWSLambda(
  (() => {
    const app = fastify().withTypeProvider<ZodTypeProvider>();

    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);

    app.register(fastifyCors, { origin: "*" });

    app.register(fastifySwagger, {
      openapi: {
        info: {
          title: "Blog API",
          version: "1.0.0",
        },
      },
      transform: jsonSchemaTransform,
    });

    app.register(fastifySwaggerUi, {
      routePrefix: "/docs",
    });

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
