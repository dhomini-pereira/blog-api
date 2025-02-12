import { z } from "zod";
import { SignUpController } from "../controllers/auth/SignUp.controller";
import { FastifyInstance } from "../types";
import sha256 from "sha256";
import { SignInController } from "../controllers/auth/SignIn.controller";
import { GetUserInfoController } from "../controllers/auth/GetUserInfo.controller";
import { AuthGuard } from "../guards/auth.guard";

export class AuthRoutes {
  static routes(app: FastifyInstance) {
    app.post(
      "/signup",
      {
        schema: {
          tags: ["authentication"],
          description: "Register a new user",
          body: z.object({
            name: z.string(),
            email: z.string().email(),
            password: z
              .string()
              .min(8)
              .max(15)
              .transform((value) => sha256(value)),
          }),
          response: {
            201: z.null({ description: "User created successfully" }),
            400: z.object({
              error: z.string(),
            }),
            500: z.object({
              error: z.string(),
            }),
          },
        },
      },
      SignUpController.handle
    );

    app.post(
      "/signin",
      {
        schema: {
          tags: ["authentication"],
          description: "Sign in",
          body: z.object({
            email: z.string().email(),
            password: z.string().transform((value) => sha256(value)),
          }),
          response: {
            200: z.object({
              token: z.string(),
            }),
            401: z.object({
              error: z.string(),
            }),
            500: z.object({
              error: z.string(),
            }),
          },
        },
      },
      SignInController.handle
    );

    app.get(
      "/user",
      {
        schema: {
          tags: ["authentication"],
          description: "Get your user info",
          response: {
            200: z.object({
              id: z.string(),
              name: z.string(),
              email: z.string().email(),
              imageUrl: z.string().nullable(),
              createdAt: z.date(),
              updatedAt: z.date(),
            }),
            403: z.object({
              error: z.string(),
            }),
            500: z.object({
              error: z.string(),
            }),
          },
        },
        preHandler: [AuthGuard.handle],
      },
      GetUserInfoController.handle
    );
  }
}
