import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../../lib/session";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default withIronSessionApiRoute(loginRoute, sessionOptions);

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  const { email } = await req.body;
  // TODO: Check password
  // TODO: Store session in db to invalidate it

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) return res.status(401);

    // TODO: Return object with only specific properties
    req.session.user = user;

    await req.session.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
}
