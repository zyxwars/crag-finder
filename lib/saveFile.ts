import formidable, { File } from "formidable";
import fs from "fs";

export const saveFile = async (file: File) => {
  // TODO: Specify path safely
  const data = fs.readFileSync(file.filepath);
  fs.writeFileSync(`../static/${file.originalFilename}`, data);
  fs.unlinkSync(file.filepath);
};
