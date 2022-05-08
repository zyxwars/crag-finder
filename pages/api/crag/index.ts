// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO: Auth middleware

  const { method } = req;

  switch (method) {
    case "POST":
      // TODO: Validate input
      // TODO: Use user from auth middleware
      const crag = await prisma.crag.create({
        data: {
          ...req.body,
          author: { connect: { email: "test@test.com" } },
        },
      });

      return res.status(201).json(crag);
      break;
    case "DELETE":
      break;

    default:
      break;
  }
}
