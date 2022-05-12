import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { withAuth } from "../../../../lib/middleware/withAuth";
import { sessionOptions } from "../../../../lib/session";
import { sendError } from "../../../../lib/responses";
import prisma from "../../../../lib/prisma";
import formidable, { File } from "formidable";
import { saveFile } from "../../../../lib/saveFile";

export default withIronSessionApiRoute(withAuth(handler), sessionOptions);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const form = formidable({ maxFiles: 1 });

    form.parse(req, async (err, fields, files) => {
      console.log(files.photo);

      // The files are limited in options so File[] is not possible
      await saveFile(files.photo as File);
    });

    // TODO: Validate input

    // const visit = await prisma.visit.create({
    //   data: {
    //     ...req.body,
    //     crag: { connect: { id: Number(req.query.id) } },
    //     author: { connect: { id: req?.session?.user?.id } },
    //   },
    // });

    // return res.status(201);
  } catch (error) {
    console.log(error);
    sendError(res);
  }
}

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
