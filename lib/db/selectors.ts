import { Photo, Prisma } from "@prisma/client";

export type PublicUser = {
  id: number;
  name: string;
  avatar?: Photo;
};

export const publicUserSelector = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  name: true,
  avatar: true,
});

// Add needed fields here
export const userSelector = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  name: true,
  email: true,
  avatar: true,
});
