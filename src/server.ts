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

    app.get("*", (request) => {
      console.log("METHOD:", request.method);
      console.log("IP:", request.ip);
      console.log("HOSTNAME:", request.hostname);
      console.log("HOST:", request.host);
      console.log("ORIGINAL URL:",request.originalUrl);

      console.log("REQUEST JSONIFY:", JSON.stringify(request))
    });

    return app;
  })()
);
