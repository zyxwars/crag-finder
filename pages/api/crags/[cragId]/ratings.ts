import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "$lib/db/prisma";
import {
  sendBadRequest,
  sendError,
  sendNoSession,
  sendNotFound,
} from "$lib/responses";
import formidable, { File, Files } from "formidable";
import { Visit } from "@prisma/client";
import { publicUserSelector } from "$lib/db/selectors";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { cragId } = req.query;

  switch (method) {
    case "POST":
      // Check session
      const session = await getSession({ req });
      if (!session) return sendNoSession(res);

      // Validate data
      const { rating } = req.body;
      if (!rating) sendBadRequest(res, "no_rating");

      try {
        const newRating = await prisma.cragRating.upsert({
          where: {
            cragId_authorId: {
              authorId: session.user.id,
              cragId: Number(cragId),
            },
          },
          update: {
            rating,
          },
          create: {
            crag: { connect: { id: Number(cragId) } },
            author: { connect: { id: session.user.id } },
            rating,
          },
        });

        return res.status(201).json(newRating);
      } catch (error) {
        console.log(error);
        return sendError(res);
      }

      break;
    default: {
      // GET
      const crag = await prisma.crag.findUnique({
        where: { id: Number(cragId) },
        select: { ratings: true },
      });
      if (!crag) return sendNotFound(res, "no_crag");

      const totalRating = crag.ratings.reduce(
        (total, rating) => total + rating.rating,
        0
      );

      const averageRating = totalRating / crag.ratings.length;

      return res.status(200).json({ averageRating });
    }
  }
}
