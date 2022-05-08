import { withIronSessionApiRoute } from "iron-session/next";
import type { NextApiRequest, NextApiResponse } from "next";
import { withAuthorization } from "../../../lib/withAuthorization";
import prisma from "../../../lib/prisma";
import { sessionOptions } from "../../../lib/session";

export default withIronSessionApiRoute(
  withAuthorization(handler),
  sessionOptions
);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case "POST":
      // TODO: Validate input
      // TODO: Use user from auth middleware
      const crag = await prisma.crag.create({
        data: {
          ...req.body,
          author: { connect: { id: req.session.user.id } },
        },
      });

      return res.status(201).json(crag);
    case "DELETE":
      break;

    default:
      break;
  }
}
