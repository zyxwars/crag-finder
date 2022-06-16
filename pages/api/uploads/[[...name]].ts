export const config = {
  api: { externalResolver: true },
};

import express from "express";
const handler = express();

if (!process.env.UPLOAD_DIR) console.log("UPLOAD_DIR is not defined");
else {
  handler.use("/api/uploads", express.static(process.env.UPLOAD_DIR));
}

export default handler;
