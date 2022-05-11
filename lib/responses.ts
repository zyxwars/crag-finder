import { NextApiResponse } from "next";

export const sendError = (res: NextApiResponse, message = "unexpected_error") =>
  res.status(500).send(message);

export const sendUnauthorized = (
  res: NextApiResponse,
  message = "auth_error"
) => res.status(401).send(message);
