// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { withIronSessionApiRoute } from "iron-session/next";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { sendUnauthorized, sendError } from "../../../../lib/responses";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query, method } = req;

  if (!query.cragId) return res.status(400).send("invalid_id");

  switch (method) {
    case "DELETE":
      // TODO: Check crag privileges
      try {
        await prisma.crag.delete({
          where: { id: Number(query.cragId) },
        });

        return res.status(200).send("crag_deleted");
      } catch (error) {
        console.log(error);
        sendError(res);
      }
      break;

    default:
      const crag = await prisma.crag.findUnique({
        where: { id: Number(query.cragId) },
        include: { visits: { include: { photos: true } } },
      });

      return res.status(200).json(crag);
  }
}
