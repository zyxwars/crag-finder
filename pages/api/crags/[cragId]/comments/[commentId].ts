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
  const { commentId, cragId } = req.query;
  const session = await getSession({ req });
  const { body } = req.body;

  switch (method) {
    case "POST":
      // Check session
      if (!session) return sendNoSession(res);

      // Validate data
      if (!body) return sendBadRequest(res, "no_body");

      // Create reply
      const comment = await prisma.comment.update({
        where: { id: Number(commentId) },
        data: {
          replies: {
            create: [
              {
                body,
                author: { connect: { id: session.user.id } },
                crag: { connect: { id: Number(cragId) } },
              },
            ],
          },
        },
      });

      return res.status(201).json(comment);
    case "DELETE":
      // Check session
      if (!session) return sendNoSession(res);

      // TODO: Crag mod perms
      // or user is author check

      const deletedComment = await prisma.comment.delete({
        where: { id: Number(commentId) },
      });

      return res.status(200).json(deletedComment);
    default:
      res.setHeader("Allow", ["POST", "DELETE"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
