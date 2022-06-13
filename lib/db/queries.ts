import { getPermissions } from "$lib/cragRoles";
import prisma from "$lib/db/prisma";
import { publicUserSelector, userSelector } from "$lib/db/selectors";
import { Session } from "next-auth";

export const getPublicUser = async (userId: number) =>
  await prisma.user.findUnique({
    where: { id: userId },
    select: publicUserSelector,
  });

export const getPrivateUser = async (
  userId: number,
  session: Session | null
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: userSelector,
  });

  // User is not authorized to this information
  if (user?.id !== session?.user.id) return null;

  return user;
};

export const getAllCrags = async () => await prisma.crag.findMany();

export const getCragWithPermissions = async (
  cragId: number,
  session: Session | null
) => {
  const crag = await prisma.crag.findUnique({ where: { id: cragId } });

  const permissions =
    session && crag
      ? await getPermissions(Number(cragId), session.user.id)
      : null;

  return { ...crag, permissions };
};
