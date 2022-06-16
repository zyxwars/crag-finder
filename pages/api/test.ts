import { Role } from "@prisma/client";
import formidable from "formidable";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const form = formidable({
    uploadDir: process.env.UPLOAD_DIR,
    keepExtensions: true,
    maxFiles: 1,
    filter: function ({ name, originalFilename, mimetype }) {
      // keep only images
      return !!(mimetype && mimetype.includes("image"));
    },
  });

  form.parse(req, (err, fields, files) => {
    console.log(process.env.UPLOAD_DIR);

    console.log(files);
  });

  return res.status(200).json({ message: "hello!" });
}
