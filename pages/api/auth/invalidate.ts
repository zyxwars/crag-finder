import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { withAuth } from "../../../lib/middleware/withAuth";
import { sessionOptions } from "../../../lib/session";

export default withIronSessionApiRoute(withAuth(handler), sessionOptions);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await prisma.user.update({
    where: {
      id: req?.session?.user?.id,
    },
    data: {
      sessionVersion: { increment: 1 },
    },
  });

  req.session.destroy();

  res.send("invalidated");
}
