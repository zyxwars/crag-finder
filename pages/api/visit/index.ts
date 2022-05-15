import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { sendError, sendUnauthorized } from "../../../lib/responses";
import prisma from "../../../lib/prisma";
import formidable, { File } from "formidable";
import { getSession } from "next-auth/react";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) return sendUnauthorized(res);

  // TODO: Validate input

  // Upload photos
  // TODO: Validate is image type
  const form = new formidable.IncomingForm({
    uploadDir: process.env.UPLOAD_DIR,
    maxFiles: 1,
  });

  form.parse(req, async (err, fields, files) => {
    // TODO: Error handling
    if (err) {
      console.log(err);
      return sendError(res);
    }
    if (!files.photo) return res.status(400).send("no_photo");
    const formPhoto = files.photo as File;

    // TODO: merge these to one query ?
    const visit = await prisma.visit.create({
      data: {
        description: fields.description as string,
        crag: { connect: { id: Number(fields.cragId) } },
        author: { connect: { id: session.user.id } },
      },
    });

    const photo = await prisma.photo.create({
      data: {
        name: formPhoto.originalFilename || "My visit photo",
        path: formPhoto.newFilename,
        size: formPhoto.size,
        visit: { connect: { id: visit.id } },
        author: { connect: { id: session.user.id } },
      },
    });

    return res.status(201).send(visit);
  });
}
