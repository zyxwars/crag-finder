import { Role } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "$lib/db/prisma";
import {
  sendBadRequest,
  sendNoPermissions,
  sendNoSession,
  sendNotFound,
} from "$lib/responses";
import { getPermissions } from "$lib/cragRoles";
import { canDeleteCragChild } from "$lib/canDelete";

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

      // Check permissions
      const permissions = await getPermissions(Number(cragId), session.user.id);
      const visit = await prisma.visit.findUnique({
        where: { id: Number(visitId) },
      });

      if (!visit) return sendNotFound(res, "no_visit");

      if (
        canDeleteCragChild(
          session,
          Number(cragId),
          visit,
          !!permissions?.deleteVisits
        )
      )
        return sendNoPermissions(res, "not_owner_or_allowed");

      // Delete visit
      const deletedVisit = await prisma.visit.delete({
        where: { id: Number(visitId) },
      });

      return res.status(200).json(deletedVisit);
    default:
      res.setHeader("Allow", ["DELETE"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
