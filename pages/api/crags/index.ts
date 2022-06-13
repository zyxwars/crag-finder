import { Role } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "$lib/db/prisma";
import { sendBadRequest, sendNoSession } from "$lib/responses";
import { getAllCrags } from "$lib/db/queries";

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
      const { name, body, tags } = req.body;
      if (!name) return sendBadRequest(res, "no_name");
      if (!body) return sendBadRequest(res, "no_body");
      if (!tags) return sendBadRequest(res, "no_tags");

      // Create crag and add owner role to creator
      // https://www.prisma.io/docs/concepts/components/prisma-client/transactions
      const crag = await prisma.crag.create({
        data: {
          name,
          body,
          author: { connect: { id: session.user.id } },
          tags,
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
      const crags = await getAllCrags();
      return res.status(200).json(crags);
  }
}
