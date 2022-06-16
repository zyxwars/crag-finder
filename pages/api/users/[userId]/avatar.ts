import { Role } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "$lib/db/prisma";
import {
  sendBadRequest,
  sendError,
  sendNoPermissions,
  sendNoSession,
} from "$lib/responses";
import { getPermissions, getRole } from "$lib/cragRoles";
import { publicUserSelector } from "$lib/db/selectors";
import { getPublicUser } from "$lib/db/queries";
import formidable, { File } from "formidable";
import { connect } from "http2";
import { existsSync, rename, renameSync, rmSync } from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { userId } = req.query;
  const session = await getSession({ req });
  let isReturned = false;

  switch (method) {
    case "POST": {
      if (!session) return sendNoSession(res);

      if (Number(userId) !== session.user.id)
        return sendNoPermissions(res, "user_not_owner");

      const form = formidable({
        uploadDir: process.env.UPLOAD_DIR,
        keepExtensions: true,
        filter: function ({ name, originalFilename, mimetype }) {
          // keep only images
          return !!(mimetype && mimetype.includes("image"));
        },
      });

      form.parse(req, async (err, fields, files) => {
        try {
          const avatar = files.avatar as File;

          // TODO: if this crashes there could be more old avatars
          try {
            const oldPhoto = await prisma.photo.delete({
              where: { userId: session.user.id },
            });
            rmSync(process.env.UPLOAD_DIR + "/" + oldPhoto.newFilename);
          } catch (error) {
            //TODO: might just not exist
            console.log(error);
          }

          const photo = await prisma.photo.create({
            data: {
              newFilename: avatar.newFilename,
              originalFilename:
                avatar.originalFilename || session.user.name + "'s avatar",
              user: { connect: { id: session.user.id } },
            },
          });

          isReturned = true;
          return res.status(200).json(photo);
        } catch (error) {
          console.log(error);
          isReturned = true;
          return sendError(res);
        }
      });

      if (!isReturned) sendError(res);

      break;
    }
    default:
      res.setHeader("Allow", ["POST"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
