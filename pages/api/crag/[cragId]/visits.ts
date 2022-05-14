import { NextApiRequest, NextApiResponse } from "next";
import { sendError } from "../../../../lib/responses";
import prisma from "../../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { cragId } = req.query;

  try {
    const visits = await prisma.visit.findMany({
      where: { cragId: Number(cragId) },
      include: { photos: true },
    });

    res.json(visits);
  } catch (error) {
    console.log(error);
    sendError(res);
  }
}
