import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "$lib/prisma";
import {
  sendBadRequest,
  sendNoPermissions,
  sendNoSession,
} from "$lib/responses";
import { getPermissions } from "$lib/cragRoles";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  const { cragId } = req.query;

  switch (method) {
    case "POST":
      const session = await getSession({ req });
      if (!session) return sendNoSession(res);

      // Validate data
      if (!cragId) return sendBadRequest(res, "no_cragId");

      const permissions = await getPermissions(Number(cragId), session.user.id);
      if (!permissions.postPhotos)
        return sendNoPermissions(res, "no_post_photos");

      return res.status(201).send("yeah");

    default:
      // GET
      // Find photos
      const photos = await prisma.photo.findMany({
        where: { cragId: Number(cragId) },
      });
      return res.status(200).json(photos);
  }
}
