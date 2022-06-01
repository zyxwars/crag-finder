import { Role } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "$lib/prisma";
import {
  sendBadRequest,
  sendNoPermissions,
  sendNoSession,
} from "$lib/responses";
import { getPermissions, getRole } from "$lib/cragRoles";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { cragId } = req.query;
  const session = await getSession({ req });

  switch (method) {
    case "GET": {
      const crag = await prisma.crag.findUnique({
        where: { id: Number(cragId) },
      });

      const permissions = await getPermissions(Number(cragId), session.user.id);

      return res.status(200).json({ ...crag, permissions });
    }
    case "PUT": {
      // Check session
      if (!session) return sendNoSession(res);

      // Get permissions
      const permissions = await getPermissions(Number(cragId), session.user.id);

      // Parse body and validate based on permissions
      const { name, body, tags } = req.body;
      const allowedChanges = {
        name: permissions.name && name,
        body: permissions.body && body,
        tags: permissions.tags && tags,
      };

      // Update crag
      const crag = await prisma.crag.update({
        where: { id: Number(cragId) },
        data: {
          ...allowedChanges,
        },
      });

      return res.status(200).json({ ...crag, allowedChanges });
    }
    case "DELETE": {
      // Check session
      if (!session) return sendNoSession(res);

      // Get user role
      const permissions = await getPermissions(Number(cragId), session.user.id);
      // Check if user is allowed to delete the crag
      if (!permissions.deleteCrag) return sendNoPermissions(res);

      // Delete crag
      const crag = await prisma.crag.delete({ where: { id: Number(cragId) } });

      return res.status(200).json(crag);
    }
    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
