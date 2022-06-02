// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import bcrypt from "bcrypt";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "$lib/prisma";
import { sendBadRequest } from "$lib/responses";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, email, password } = req.body;
  if (!name) return sendBadRequest(res, "no_name");
  if (!email) return sendBadRequest(res, "no_email");
  if (!password) return sendBadRequest(res, "no_password");

  const hashedPassword = bcrypt.hashSync(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  res.status(200).json(user);
}
