import { NextApiRequest, NextApiResponse } from "next";
import { sendError } from "../../../../lib/responses";
import prisma from "../../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  try {
    const visits = await prisma.visit.findMany({
      where: { cragId: Number(id) },
      include: { photos: true },
    });

    res.json(visits);
  } catch (error) {
    console.log(error);
    sendError(res);
  }
}
