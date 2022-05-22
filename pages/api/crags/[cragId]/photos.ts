import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "$lib/prisma";
import { sendNoSession } from "$lib/responses";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "POST":
      const session = await getSession({ req });
      if (!session) return sendNoSession(res);

      // TODO:

      return res.status(501).send("");

    default:
      const { cragId } = req.query;

      // GET
      // Find photos
      const photos = await prisma.photo.findMany({
        where: { cragId: Number(cragId) },
      });
      return res.status(200).json(photos);
  }
}
