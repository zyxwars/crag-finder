import { withIronSessionApiRoute } from "iron-session/next";
import type { NextApiRequest, NextApiResponse } from "next";
import { withAuth } from "../../../lib/middleware/withAuth";
import prisma from "../../../lib/prisma";
import { sessionOptions } from "../../../lib/session";

export default withIronSessionApiRoute(withAuth(handler), sessionOptions);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case "POST":
      // TODO: Validate input
      const crag = await prisma.crag.create({
        data: {
          ...req.body,
          // @ts-ignore req.session will always exist exist after passing withAuthorization middleware
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
