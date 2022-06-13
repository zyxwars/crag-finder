import { Role } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "$lib/db/prisma";
import {
  sendBadRequest,
  sendNoPermissions,
  sendNoSession,
} from "$lib/responses";
import { getPermissions, getRole } from "$lib/cragRoles";
import { publicUserSelector } from "$lib/db/selectors";
import { getPrivateUser, getPublicUser } from "$lib/db/queries";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { userId } = req.query;
  const session = await getSession({ req });

  switch (method) {
    case "GET": {
      const user = await getPrivateUser(Number(userId), session);

      return res.status(200).json(user);
    }
    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
