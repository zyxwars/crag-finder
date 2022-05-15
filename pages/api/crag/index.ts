import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";
import { sendError, sendUnauthorized } from "../../../lib/responses";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session) return sendUnauthorized(res);

  // TODO: Validate input
  const crag = await prisma.crag.create({
    data: {
      ...req.body,
      author: { connect: { id: session.user.id } },
    },
  });

  return res.status(201).json(crag);
}
