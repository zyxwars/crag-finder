// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { sendError } from "../../../lib/responses";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req;

  if (!query.id) return res.status(400).send("invalid_id");

  try {
    const crag = await prisma.crag.findUnique({
      where: { id: Number(query.id) },
    });

    return res.status(200).json(crag);
  } catch (error) {
    console.log(error);
    sendError(res);
  }
}
