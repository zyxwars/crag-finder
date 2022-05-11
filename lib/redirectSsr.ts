import { ServerResponse } from "http";
import { NextApiResponse } from "next";

export const redirectSsr = (
  res: NextApiResponse | ServerResponse,
  url: string
) => {
  res.writeHead(302, { Location: url });
  res.end();

  // Return this in the main function
  return { props: {} };
};
