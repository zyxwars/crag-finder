import { Prisma } from "@prisma/client";

export const publicUserSelector = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  name: true,
});

// Add needed fields here
export const userSelector = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  name: true,
  email: true,
  password: false,
});
