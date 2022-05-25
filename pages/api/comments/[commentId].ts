import { Role } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "$lib/prisma";
import { sendBadRequest, sendNoSession } from "$lib/responses";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { commentId } = req.query;

  switch (method) {
    case "POST":
      // Check session
      const session = await getSession({ req });
      if (!session) return sendNoSession(res);

      // Validate data
      const { body } = req.body;
      if (!body) sendBadRequest(res, "no_body");

      // Create reply
      // TODO: Group replies without having to query every single one
      const comment = await prisma.comment.update({
        where: { id: Number(commentId) },
        data: {
          replies: {
            create: [
              {
                body,
                author: { connect: { id: session.user.id } },
              },
            ],
          },
        },
      });

      return res.status(201).json(comment);
    default:
      res.setHeader("Allow", ["POST", "DELETE"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
