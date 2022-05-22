import { NextApiResponse } from "next";

export const sendError = (res: NextApiResponse, message = "unexpected_error") =>
  res.status(500).send(message);

export const sendNoSession = (res: NextApiResponse, message = "no_session") =>
  res.status(401).send(message);

export const sendBadRequest = (res: NextApiResponse, message = "bad_request") =>
  res.status(400).send(message);
