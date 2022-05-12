import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { withAuth } from "../../../../lib/middleware/withAuth";
import { sessionOptions } from "../../../../lib/session";
import { sendError } from "../../../../lib/responses";
import prisma from "../../../../lib/prisma";
import formidable, { File } from "formidable";
import { saveFile } from "../../../../lib/saveFile";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default withIronSessionApiRoute(withAuth(handler), sessionOptions);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const form = new formidable.IncomingForm({
    uploadDir: process.env.UPLOAD_DIR,
    maxFiles: 1,
  });

  // TODO: Validate input

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.log(err);
      return sendError(res);
    }

    if (!files.photo) return res.status(400).send("no_photo");
    const formPhoto = files.photo as File;

    // TODO: merge these to one query ?
    const visit = await prisma.visit.create({
      data: {
        ...req.body,
        crag: { connect: { id: Number(req.query.id) } },
        author: { connect: { id: req?.session?.user?.id } },
      },
    });

    const photo = await prisma.photo.create({
      data: {
        name: formPhoto.originalFilename || "My visit photo",
        path: formPhoto.newFilename,
        size: formPhoto.size,
        visit: { connect: { id: visit.id } },
        author: { connect: { id: req?.session?.user?.id } },
      },
    });

    return res.status(201).send({ visit, photo });
  });
}
