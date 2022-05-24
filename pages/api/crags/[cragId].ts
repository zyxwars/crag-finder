import { Role } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "$lib/prisma";
import {
  sendBadRequest,
  sendNoPermissions,
  sendNoSession,
} from "$lib/responses";
import { getRole } from "$lib/cragRoles";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "PUT":
      // TODO: Add put method
      break;
    case "DELETE":
      // Check session
      const session = await getSession({ req });
      if (!session) return sendNoSession(res);

      // Validate data
      const { cragId } = req.query;
      if (!cragId) return sendBadRequest(res, "no_cragId");

      // Get user role
      const role = await getRole(Number(cragId), session.user.id);
      // Check if user is allowed to delete the crag
      if (!(role === Role.OWNER)) return sendNoPermissions(res);

      // Delete crag
      const crag = await prisma.crag.delete({ where: { id: Number(cragId) } });

      return res.status(200).send(crag);
    default:
      res.setHeader("Allow", ["PUT", "DELETE"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
