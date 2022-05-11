import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import prisma from "../prisma";

const validateSession = async (req: NextApiRequest) => {
  if (!req.session.user) return "no_session";

  const user = await prisma.user.findUnique({
    where: { id: req.session.user.id },
  });

  if (!user) return "no_user";

  if (user.sessionVersion > req.session.user.sessionVersion)
    return "expired_session";

  return null;
};

export const withOptionalAuth =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    req.session.error = await validateSession(req);

    return handler(req, res);
  };
