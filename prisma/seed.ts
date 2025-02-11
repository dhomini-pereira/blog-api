import { PrismaClient } from "@prisma/client";
import data from "./data.json";
import sha256 from "sha256";

const prisma = new PrismaClient();

async function main() {
  await Promise.all(
    data.permissions.map((permission) => {
      return prisma.permission.upsert({
        where: {
          id: permission.id,
        },
        create: permission,
        update: permission,
      });
    })
  );

  await Promise.all(
    data.roles.map((role) => {
      return prisma.role.upsert({
        where: {
          id: role.id,
        },
        create: {
          ...role,
          permissions: {
            connect: role.permissions.map((value) => ({ id: value })),
          },
        },
        update: {
          ...role,
          permissions: {
            connect: role.permissions.map((value) => ({ id: value })),
          },
        },
      });
    })
  );

  await prisma.user.upsert({
    where: {
      email: process.env.ADMIN_EMAIL,
    },
    create: {
      email: process.env.ADMIN_EMAIL as string,
      name: process.env.ADMIN_NAME as string,
      password: sha256(process.env.ADMIN_PASSWORD as string),
      roles: {
        connect: {
          id: 1,
        },
      },
    },
    update: {
      email: process.env.ADMIN_EMAIL as string,
      name: process.env.ADMIN_NAME as string,
      password: sha256(process.env.ADMIN_PASSWORD as string),
      roles: {
        connect: {
          id: 1,
        },
      },
    },
  });
}

main()
  .catch(console.log)
  .finally(async () => await prisma.$disconnect());
