// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { withIronSessionApiRoute } from "iron-session/next";
import type { NextApiRequest, NextApiResponse } from "next";
import { withAuth } from "../../../../lib/middleware/withAuth";
import { withOptionalAuth } from "../../../../lib/middleware/withOptionalAuth";
import prisma from "../../../../lib/prisma";
import { sendUnauthorized, sendError } from "../../../../lib/responses";
import { sessionOptions } from "../../../../lib/session";

export default withIronSessionApiRoute(
  withOptionalAuth(handler),
  sessionOptions
);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query, method } = req;

  if (!query.id) return res.status(400).send("invalid_id");

  switch (method) {
    case "DELETE":
      if (req.session.error) return sendUnauthorized(res, req.session.error);

      // TODO: Check crag privileges
      try {
        await prisma.crag.delete({
          where: { id: Number(query.id) },
        });

        return res.status(200).send("crag_deleted");
      } catch (error) {
        console.log(error);
        sendError(res);
      }
      break;

    default:
      try {
        const crag = await prisma.crag.findUnique({
          where: { id: Number(query.id) },
        });

        return res.status(200).json(crag);
      } catch (error) {
        console.log(error);
        sendError(res);
      }
      break;
  }
}
