import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import prisma from "../prisma";

export const withAuth =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.session.user) return res.status(401).send("no_session");

    const user = await prisma.user.findUnique({
      where: { id: req.session.user.id },
    });

    if (!user) return res.status(404).send("no_user");

    if (user.sessionVersion > req.session.user.sessionVersion)
      return res.status(401).send("expired_session");

    return handler(req, res);
  };
