import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "$lib/db/prisma";
import { sendBadRequest, sendNoSession } from "$lib/responses";
import { publicUserSelector } from "$lib/db/selectors";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  // TODO: Handle crag doesn't exist
  const { cragId } = req.query;

  switch (method) {
    case "POST":
      // Check session
      const session = await getSession({ req });
      if (!session) return sendNoSession(res);

      // Validate data
      const { body } = req.body;
      if (!body) return sendBadRequest(res, "no_body");

      // Create comment
      const comment = await prisma.comment.create({
        data: {
          body,
          author: { connect: { id: session.user.id } },
          crag: { connect: { id: Number(cragId) } },
        },
      });

      return res.status(201).json(comment);
    default:
      // GET
      // Find comments
      const comments = await prisma.comment.findMany({
        where: { cragId: Number(cragId) },
        include: { author: { select: publicUserSelector } },
      });

      return res.status(200).json(comments);
  }
}
