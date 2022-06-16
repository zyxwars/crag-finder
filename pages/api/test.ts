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
  const form = formidable({});

  form.parse(req, (err, fields, files) => {
    console.log(files.test);
  });

  return res.status(200).json({ message: "hello!" });
}
