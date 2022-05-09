import { withIronSessionApiRoute } from "iron-session/next";
import type { NextApiRequest, NextApiResponse } from "next";
import { withAuth } from "../../../lib/middleware/withAuth";
import prisma from "../../../lib/prisma";
import { sessionOptions } from "../../../lib/session";

export default withIronSessionApiRoute(withAuth(handler), sessionOptions);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  //@ts-ignore
  switch (method) {
    case "POST":
      // TODO: Validate input
      const crag = await prisma.crag.create({
        data: {
          ...req.body,
          author: { connect: { id: req?.session?.user?.id } },
        },
      });

      return res.status(201).json(crag);
    case "DELETE":
      break;

    default:
      break;
  }
}
