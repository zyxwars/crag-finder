import { GetServerSidePropsContext, NextPageContext } from "next";
import prisma from "../prisma";

// TODO: Make into actual middleware
// @ts-ignore Let iron session typing do its thing
export const withAuthSsr = async (req) => {
  if (!req) return null;

  if (!req.session.user) return null;

  const user = await prisma.user.findUnique({
    where: { id: req.session.user.id },
  });

  if (!user) return null;

  if (user.sessionVersion > req.session.user.sessionVersion) return null;

  return req.session;
};
