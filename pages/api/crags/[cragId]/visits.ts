import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "$lib/db/prisma";
import { sendBadRequest, sendNoSession } from "$lib/responses";
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

  // TODO: Handle crag doesn't exist
  const { cragId } = req.query;

  switch (method) {
    case "POST":
      // Check session
      const session = await getSession({ req });
      if (!session) return sendNoSession(res);

      // Validate data
      const form = formidable({
        uploadDir: process.env.UPLOAD_DIR,
        keepExtensions: true,
        // This is important to access all files in the callback
        multiples: true,
        filter: function ({ name, originalFilename, mimetype }) {
          // keep only images
          return !!(mimetype && mimetype.includes("image"));
        },
      });

      await form.parse(req, async (err, fields, files) => {
        // Extract photos
        let photos = [];
        if (Array.isArray(files.photos)) photos = files.photos;
        else photos = [files.photos];

        // Create visit
        const visit = await prisma.visit.create({
          data: {
            photos: {
              create: photos.map((photo) => ({
                newFilename: photo.newFilename,
                originalFilename: photo.originalFilename || photo.newFilename,
              })),
            },
            author: { connect: { id: session.user.id } },
            crag: { connect: { id: Number(cragId) } },
          },
        });

        return res.status(201).json(visit);
      });

      break;
    default:
      // GET
      // Find comments
      const visits = await prisma.visit.findMany({
        where: { cragId: Number(cragId) },
        include: { author: { select: publicUserSelector }, photos: true },
      });

      return res.status(200).json(visits);
  }
}
