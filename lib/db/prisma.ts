//@ts-nocheck
import { PrismaClient } from "@prisma/client";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

// prisma.$use(async (params, next) => {
//   console.log(params);

//   return next(params);
// });

prisma.$on("query", (e) => {
  console.log(e);
});

export default prisma;
