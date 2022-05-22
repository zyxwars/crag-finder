import { Role } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";
import { sendBadRequest, sendNoSession } from "../../../lib/responses";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "POST":
      // Check session
      const session = await getSession({ req });
      if (!session) return sendNoSession(res);

      // Validate data
      const { name, content } = req.body;
      if (!name) sendBadRequest(res, "no_name");
      if (!content) sendBadRequest(res, "no_content");

      // Create crag and add owner role to creator
      // https://www.prisma.io/docs/concepts/components/prisma-client/transactions
      const crag = await prisma.crag.create({
        data: {
          name,
          content,
          author: { connect: { id: session.user.id } },
          cragRoles: {
            create: [
              {
                role: Role.OWNER,
                user: { connect: { id: session.user.id } },
              },
            ],
          },
        },
      });

      return res.status(201).json(crag);
    default:
      // GET
      // Find crags
      const crags = await prisma.crag.findMany();
      return res.status(200).json(crags);
  }
}
