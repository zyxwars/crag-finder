import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";
import { sendError, sendUnauthorized } from "../../../lib/responses";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO: Get user from session
  const session = await getSession({ req });

  if (!session) return sendUnauthorized(res);

  console.log(session);

  try {
    // TODO: Validate input
    const crag = await prisma.crag.create({
      data: {
        ...req.body,
        author: { connect: { email: session.user?.email } },
      },
    });

    return res.status(201).json(crag);
  } catch (error) {
    console.log(error);
    sendError(res);
  }
}
