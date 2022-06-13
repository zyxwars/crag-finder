import { Role } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "$lib/db/prisma";
import { sendBadRequest, sendNoSession } from "$lib/responses";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { visitId, cragId } = req.query;
  const session = await getSession({ req });

  switch (method) {
    case "DELETE":
      // Check session
      if (!session) return sendNoSession(res);

      // TODO: Crag mod perms
      // or user is author check

      const deletedVisit = await prisma.visit.delete({
        where: { id: Number(visitId) },
      });

      return res.status(200).json(deletedVisit);
    default:
      res.setHeader("Allow", ["DELETE"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
