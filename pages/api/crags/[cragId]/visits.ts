import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "$lib/prisma";
import { sendBadRequest, sendNoSession } from "$lib/responses";
import formidable, { File, Files } from "formidable";
import { Visit } from "@prisma/client";

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
      const form = new formidable.IncomingForm();
      form.uploadDir = process.env.UPLOAD_DIR;
      form.keepExtensions = true;
      await form.parse(req, async (err, fields, files) => {
        // Extract photos
        let photos = [];
        if (Array.isArray(files.photos)) photos = files.photos;
        else photos = [files.photos];

        console.log(files.photos);

        //Create visit
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
        include: { author: { select: { id: true, name: true } }, photos: true },
      });

      return res.status(200).json(visits);
  }
}